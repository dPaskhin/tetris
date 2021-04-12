import { Side } from '@src/Common/enums/Side';

export type IShapeMoveLimitationSides = Exclude<Side, Side.TOP>;
