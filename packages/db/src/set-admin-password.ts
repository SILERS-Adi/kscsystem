/**
 * Ustawia (lub tworzy) konto superadmina z hasłem.
 *
 * Użycie:
 *   ADMIN_EMAIL=admin@silers.pl ADMIN_PASSWORD='twoje-haslo' npm run db:set-admin-password
 *
 * Hasło NIE jest zapisywane w repo — przekazujesz je przez zmienną środowiskową.
 */
import bcrypt from "bcryptjs";
import { prisma } from "./index";

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@silers.pl").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!password || password.length < 8) {
    console.error("✖ Ustaw ADMIN_PASSWORD (min. 8 znaków). Przykład:");
    console.error("  ADMIN_EMAIL=admin@silers.pl ADMIN_PASSWORD='...' npm run db:set-admin-password");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "superadmin", isActive: true },
    create: { email, name: "Super Admin", role: "superadmin", isActive: true, passwordHash },
  });

  console.log(`✔ Hasło ustawione dla superadmina: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
