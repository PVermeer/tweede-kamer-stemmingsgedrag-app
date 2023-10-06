import { FormControl } from '@angular/forms';
import {
  BesluitOptions,
  Fractie,
} from '../../../functions/src/tweedekamer-api.types';

export type BesluitFilter<B = Required<BesluitOptions>> = Partial<{
  [P in keyof B]: B[P] extends string | null
    ? string | null
    : B[P] extends number | null
    ? number | null
    : B[P] extends Fractie | null
    ? Required<Fractie['Id']> | null
    : never;
}>;

/** Retype besluit options to formcontrols */
export type BesluitFilterForm<B = Required<BesluitOptions>> = {
  [P in keyof B]: B[P] extends string | null
    ? FormControl<string | null>
    : B[P] extends number | null
    ? FormControl<number | null>
    : B[P] extends Fractie | null
    ? FormControl<Required<Fractie['Id']> | null>
    : never;
};
