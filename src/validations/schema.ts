import { z } from "zod";

/** 収支データ入力フォーム用スキーマ */
export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, { message: "日付は必須です" }),
  amount: z.number().min(1, { message: "金額は１円以上が必須です" }),
  content: z
    .string()
    .min(1, { message: "内容を入力してください。" })
    .max(50, { message: "内容は50文字以内にしてください。" }),
  category: z
    .union([
      z.enum(["食費", "日用品", "住居費", "交際費", "娯楽", "交通費"]),
      z.enum(["給与", "副収入", "お小遣い"]),
      z.literal(""),
    ])
    .superRefine((val, ctx) => {
      if (val === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "カテゴリを選択してください。",
        });
      }
    }),
});

/** ユーザーアカウント作成フォーム用スキーマ */
export const userSignUpSchema = z
  .object({
    name: z.string().min(1, { message: "ユーザー名は必須です" }),
    email: z
      .string()
      .email({ message: "有効なメールアドレスを入力してください" }),
    password: z
      .string()
      .min(6, { message: "パスワードは6文字以上で入力してください" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

/** ユーザーログインフォーム用スキーマ */
export const userSignInSchema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
  password: z
    .string()
    .min(6, { message: "パスワードは6文字以上で入力してください" }),
});

export type Schema = z.infer<typeof transactionSchema>;
export type SignUpSchema = z.infer<typeof userSignUpSchema>;
export type SignInSchema = z.infer<typeof userSignInSchema>;
