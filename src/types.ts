// Define newtype/branded types

import { z } from './index';

export type CID = string & { readonly __brand: unique symbol };
export const CID = z.string().transform((val) => val as CID);

export type SS58Address = string & { readonly __brand: unique symbol };
export const SS58Address = z.string().transform((val) => val as SS58Address);


