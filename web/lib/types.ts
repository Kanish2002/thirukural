export type LocalizedName = {
  ta?: string;
  en?: string;
};

export type KuralResponse = {
  number: number;
  section?: {
    id?: number;
    names?: LocalizedName;
  };
  chapter?: {
    id?: number;
    names?: LocalizedName;
  };
  kural: [string, string] | string[];
  transliteration?: string[];
  meaning: {
    ta_mu_va?: string;
    ta_salamon?: string;
    ta_kalaignar?: string;
    en?: string;
    en_modern?: string;
  };
};
