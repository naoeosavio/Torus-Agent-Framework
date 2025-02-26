import {
  Agent,
  AgentServer,
  z,
} from '../src';
import {
  CID,
  SS58Address,
} from '../src/types';

// Define output schemas.
const PinStatus = z.object({
  cid: CID,
  status: z.enum(["pinned", "pinning", "failed"]),
  size: z.number(),
  addedAt: z.date(),
  pinError: z.string().optional(),
});

const QuotaInfo = z.object({
  filesUsed: z.number(),
  filesTotal: z.number(),
  bytesUsed: z.number(),
  bytesTotal: z.number(),
});

const PaymentQuote = z.object({
  requestedBytes: z.number().optional(),
  requestedFiles: z.number().optional(),
  price: z.string(),
  paymentAddress: SS58Address,
  quoteId: z.string(),
  validUntil: z.date(),
});

const PaymentStatus = z.object({
  quoteId: z.string(),
  status: z.enum(["pending", "confirmed", "failed"]),
  transactionHash: z.string().optional(),
});

// Create an Agent instance and register methods with input/output schemas.
export const IPFSAgent = new Agent()
  .method(
    "getPinStatus",
    {
      input: z.object({
        cid: CID,
      }),
      output: PinStatus,
      description: "Get current quota usage and limits",
    },
    async ({ cid }) => {
      // TODO: Fetch quota info from your storage management service.
      return {
        cid,
        status: "pinned" as "pinned",
        size: 12345,
        addedAt: new Date(),
        pinError: undefined,
      };
    }
  )
  .method(
    "getQuota",
    {
      input: z.object({}),
      output: QuotaInfo,
      description: "Get current quota usage and limits",
    },
    async () => {
      // TODO: Fetch quota info from your storage management service.
      return {
        filesUsed: 2,
        filesTotal: 10,
        bytesUsed: 2048,
        bytesTotal: 10485760,
      };
    }
  )
  .method(
    "requestQuotaIncrease",
    {
      input: z.object({
        additionalBytes: z.number().optional(),
        additionalFiles: z.number().optional(),
      }),
      output: PaymentQuote,
      description: "Get a quote for increasing storage quota",
    },
    async ({ additionalBytes, additionalFiles }) => {
      // TODO: Compute payment details based on requested increases.
      return {
        requestedBytes: additionalBytes,
        requestedFiles: additionalFiles,
        price: "0.01 DOT",
        paymentAddress:
          "5F3sa2TJAWMqDhXG6jhV4N8ko9nc8JBdRb1u5PZPZimF4kaE" as SS58Address,
        quoteId: "quote123",
        validUntil: new Date(Date.now() + 3600 * 1000),
      };
    }
  )
  .method(
    "confirmPayment",
    {
      input: z.object({
        quoteId: z.string(),
        transactionHash: z.string(),
      }),
      output: PaymentStatus,
      description: "Confirm a payment for quota increase",
    },
    async ({ quoteId, transactionHash }) => {
      // TODO: Validate on-chain payment receipt.
      return {
        quoteId,
        status: "confirmed" as "confirmed",
        transactionHash,
      };
    }
  )
  .method(
    "pinFile",
    {
      input: z.object({
        file: z.instanceof(Buffer),
      }),
      output: CID,
      description: "Pin a file to IPFS",
    },
    async ({ file }) => {
      // TODO: Use an IPFS client (e.g. ipfs-http-client) to pin the file.
      return "QmDummyCid12345" as CID;
    }
  );

// If this module is executed directly, start the AgentServer.
if (require.main === module) {
  const server = new AgentServer(IPFSAgent, { port: 3000 });
  server.start().then(() => {
    console.log("Pinning Agent server started on port 3000");
  });
}
