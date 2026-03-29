import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const {
  mockSend,
  mockChargeAutoTopup,
  mockAddCredits,
  mockSendAutoTopupSuccessEmail,
  mockSendAutoTopupFailedEmail,
  mockSendLowBalanceWarningEmail,
} = vi.hoisted(() => ({
  mockSend: vi.fn(),
  mockChargeAutoTopup: vi.fn(),
  mockAddCredits: vi.fn(),
  mockSendAutoTopupSuccessEmail: vi.fn(),
  mockSendAutoTopupFailedEmail: vi.fn(),
  mockSendLowBalanceWarningEmail: vi.fn(),
}));

vi.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: vi.fn(),
}));

vi.mock('@aws-sdk/lib-dynamodb', () => {
  class MockScanCommand {
    input: any;
    constructor(input: any) {
      this.input = input;
    }
  }
  class MockUpdateCommand {
    input: any;
    constructor(input: any) {
      this.input = input;
    }
  }
  return {
    DynamoDBDocumentClient: {
      from: vi.fn(() => ({
        send: mockSend,
      })),
    },
    ScanCommand: MockScanCommand,
    UpdateCommand: MockUpdateCommand,
  };
});

vi.mock('../lib/billing', () => ({
  chargeAutoTopup: mockChargeAutoTopup,
}));

vi.mock('../lib/db', () => ({
  addCredits: mockAddCredits,
}));

vi.mock('../lib/email', () => ({
  sendAutoTopupSuccessEmail:
    mockSendAutoTopupSuccessEmail.mockResolvedValue(undefined),
  sendAutoTopupFailedEmail:
    mockSendAutoTopupFailedEmail.mockResolvedValue(undefined),
  sendLowBalanceWarningEmail:
    mockSendLowBalanceWarningEmail.mockResolvedValue(undefined),
}));

import { handler } from './auto-topup-check';

describe('auto-topup-check handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    process.env.DYNAMO_TABLE = 'test-table';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should top up users with balance below threshold', async () => {
    const mockUser = {
      PK: 'USER#test@example.com',
      SK: 'METADATA',
      EntityType: 'UserMetadata',
      autoTopupEnabled: true,
      aiTokenBalanceCents: 50, // $0.50, below $1.00 threshold
      aiRefillThresholdCents: 100,
      aiTopupAmountCents: 1000,
      stripeCustomerId: 'cus_123',
    };

    mockSend.mockResolvedValueOnce({
      Items: [mockUser],
    });

    mockChargeAutoTopup.mockResolvedValueOnce(true);
    mockAddCredits.mockResolvedValueOnce({
      newBalance: 1050,
      wasSuspended: false,
    });

    await handler({});

    expect(mockChargeAutoTopup).toHaveBeenCalledWith(
      'cus_123',
      1000,
      expect.stringContaining('ClawMore Auto Top-Up')
    );

    expect(mockAddCredits).toHaveBeenCalledWith('test@example.com', 1000);
    expect(mockSendAutoTopupSuccessEmail).toHaveBeenCalled();
  });

  it('should not top up if no Stripe customer ID', async () => {
    const mockUser = {
      PK: 'USER#nocustomer@example.com',
      SK: 'METADATA',
      EntityType: 'UserMetadata',
      autoTopupEnabled: true,
      aiTokenBalanceCents: 50,
      aiRefillThresholdCents: 100,
      aiTopupAmountCents: 1000,
      // No stripeCustomerId
    };

    mockSend.mockResolvedValueOnce({
      Items: [mockUser],
    });

    await handler({});

    expect(mockChargeAutoTopup).not.toHaveBeenCalled();
    expect(mockAddCredits).not.toHaveBeenCalled();
  });

  it('should send failure email if charge fails', async () => {
    const mockUser = {
      PK: 'USER#fail@example.com',
      SK: 'METADATA',
      EntityType: 'UserMetadata',
      autoTopupEnabled: true,
      aiTokenBalanceCents: 50,
      aiRefillThresholdCents: 100,
      aiTopupAmountCents: 1000,
      stripeCustomerId: 'cus_fail',
    };

    mockSend.mockResolvedValueOnce({
      Items: [mockUser],
    });

    mockChargeAutoTopup.mockResolvedValueOnce(false);

    await handler({});

    expect(mockChargeAutoTopup).toHaveBeenCalled();
    expect(mockAddCredits).not.toHaveBeenCalled();
    expect(mockSendAutoTopupFailedEmail).toHaveBeenCalled();
  });

  it('should send low-balance warning when balance is between 1x and 2x threshold', async () => {
    const mockUser = {
      PK: 'USER#warn@example.com',
      SK: 'METADATA',
      EntityType: 'UserMetadata',
      autoTopupEnabled: true,
      aiTokenBalanceCents: 150, // $1.50, between $1.00 and $2.00
      aiRefillThresholdCents: 100,
      aiTopupAmountCents: 1000,
      stripeCustomerId: 'cus_warn',
    };

    mockSend.mockResolvedValueOnce({
      Items: [mockUser],
    });

    // Mock the UpdateCommand for marking warning as sent
    mockSend.mockResolvedValueOnce({});

    await handler({});

    expect(mockChargeAutoTopup).not.toHaveBeenCalled();
    expect(mockSendLowBalanceWarningEmail).toHaveBeenCalled();
  });

  it('should not send warning if already sent within 24 hours', async () => {
    const recentWarningTime = new Date(
      Date.now() - 12 * 60 * 60 * 1000
    ).toISOString(); // 12 hours ago

    const mockUser = {
      PK: 'USER#recentwarn@example.com',
      SK: 'METADATA',
      EntityType: 'UserMetadata',
      autoTopupEnabled: true,
      aiTokenBalanceCents: 150,
      aiRefillThresholdCents: 100,
      aiTopupAmountCents: 1000,
      stripeCustomerId: 'cus_recent',
      lastLowBalanceWarningAt: recentWarningTime,
    };

    mockSend.mockResolvedValueOnce({
      Items: [mockUser],
    });

    await handler({});

    expect(mockSendLowBalanceWarningEmail).not.toHaveBeenCalled();
  });

  it('should process multiple users', async () => {
    const mockUsers = [
      {
        PK: 'USER#user1@example.com',
        SK: 'METADATA',
        EntityType: 'UserMetadata',
        autoTopupEnabled: true,
        aiTokenBalanceCents: 50,
        aiRefillThresholdCents: 100,
        aiTopupAmountCents: 1000,
        stripeCustomerId: 'cus_1',
      },
      {
        PK: 'USER#user2@example.com',
        SK: 'METADATA',
        EntityType: 'UserMetadata',
        autoTopupEnabled: true,
        aiTokenBalanceCents: 50,
        aiRefillThresholdCents: 100,
        aiTopupAmountCents: 1000,
        stripeCustomerId: 'cus_2',
      },
    ];

    mockSend.mockResolvedValueOnce({
      Items: mockUsers,
    });

    mockChargeAutoTopup.mockResolvedValue(true);
    mockAddCredits.mockResolvedValue({
      newBalance: 1050,
      wasSuspended: false,
    });

    await handler({});

    expect(mockChargeAutoTopup).toHaveBeenCalledTimes(2);
    expect(mockAddCredits).toHaveBeenCalledTimes(2);
  });
});
