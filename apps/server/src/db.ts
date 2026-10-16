import { PrismaClient } from "./generated/prisma";

/** One client per process. */
export const prisma = new PrismaClient();

/** Either the root client or an interactive transaction. */
export type Db = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
