const MessageDigestAlgorithms = [
  'gost-mac',
  'md4',
  'md5',
  'md_gost94',
  'ripemd160',
  'sha1',
  'sha224',
  'sha256',
  'sha384',
  'sha512',
  'streebog256',
  'streebog512',
  'whirlpool',
] as const;

export type MessageDigestAlgorithm = typeof MessageDigestAlgorithms[number];
export type PayloadData = Record<string, unknown>;
