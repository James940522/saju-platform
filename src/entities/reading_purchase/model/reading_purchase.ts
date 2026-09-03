export type DemoPaymentMethod =
  | "kakao-pay"
  | "naver-pay"
  | "toss-pay";

export type DemoReadingPurchase = {
  readingCode: string;
  method: DemoPaymentMethod;
  amount: number;
  paidAt: string;
};
