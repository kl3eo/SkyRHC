// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
//hack ash
//export type LinkTypes = 'address' | 'block' | 'bounty' | 'council' | 'extrinsic' | 'proposal' | 'referendum' | 'techcomm' | 'tip' | 'treasury';
export type LinkTypes = 'address' | 'block' | 'bounty' | 'council' | 'extrinsic' | 'proposal' | 'referendum' | 'tip' | 'treasury';

export interface ExternalDef {
  chains: Record<string, string>;
  isActive: boolean;
  logo: string;
  paths: Partial<Record<LinkTypes, string>>;
  url: string;
  create: (chain: string, path: string, data: BN | number | string, hash?: string) => string;
}
