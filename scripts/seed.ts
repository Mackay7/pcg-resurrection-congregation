// scripts/seed.ts
// Seeds the database with demo data for development
// Run: npm run db:seed

import { PrismaClient, MemberStatus, MemberRole, GroupType, EventType, PaymentMethod, DonationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Households ────────────────────────────────────────────
  const [bonsu, asante, nkrumah, osei] = await Promise.all([
    prisma.household.create({ data: { name: "Bonsu Family", address: "12 Oak Lane", city: "Atlanta", state: "GA", zip: "30301" } }),
    prisma.household.create({ data: { name: "Asante Family", address: "45 Elm Street", city: "Atlanta", state: "GA", zip: "30302" } }),
    prisma.household.create({ data: { name: "Nkrumah Household", address: "8 Maple Drive", city: "Atlanta", state: "GA", zip: "30303" } }),
    prisma.household.create({ data: { name: "Osei Family", address: "91 Peach Blvd", city: "Atlanta", state: "GA", zip: "30304" } }),
  ]);

  // ── Members ───────────────────────────────────────────────
  const [akua, elder, esther, kwame] = await Promise.all([
    prisma.member.create({ data: { householdId: bonsu.id, firstName: "Akua", lastName: "Bonsu", email: "akua.bonsu@pcgresurrection.org", phone: "(404) 555-0121", status: MemberStatus.ACTIVE, role: MemberRole.STAFF, joinedAt: new Date("2019-03-12") } }),
    prisma.member.create({ data: { householdId: asante.id, firstName: "Elder", lastName: "Asante", email: "elder.asante@pcgresurrection.org", phone: "(404) 555-0188", status: MemberStatus.ACTIVE, role: MemberRole.ADMIN, joinedAt: new Date("2015-08-01") } }),
    prisma.member.create({ data: { householdId: nkrumah.id, firstName: "Esther", lastName: "Nkrumah", email: "esther.nkrumah@pcgresurrection.org", phone: "(404) 555-0143", status: MemberStatus.ACTIVE, role: MemberRole.MEMBER, joinedAt: new Date("2022-01-15") } }),
    prisma.member.create({ data: { householdId: osei.id, firstName: "Kwame", lastName: "Osei", email: "kwame.osei@pcgresurrection.org", phone: "(404) 555-0177", status: MemberStatus.ACTIVE, role: MemberRole.MEMBER, joinedAt: new Date("2018-11-30") } }),
  ]);

  // ── Giving Funds ──────────────────────────────────────────
  const [tithe, building, missions, children] = await Promise.all([
    prisma.givingFund.create({ data: { name: "General tithe", description: "Support our church community", isActive: true, displayOrder: 1 } }),
    prisma.givingFund.create({ data: { name: "Building fund", description: "Help us expand our facilities", isActive: true, displayOrder: 2 } }),
    prisma.givingFund.create({ data: { name: "Missions", description: "Support global outreach", isActive: true, displayOrder: 3 } }),
    prisma.givingFund.create({ data: { name: "Children's ministry", description: "Invest in the next generation", isActive: true, displayOrder: 4 } }),
  ]);

  // ── Donations ─────────────────────────────────────────────
  await prisma.donation.createMany({
    data: [
      { memberId: akua.id, fundId: tithe.id, amountCents: 50000, paymentMethod: PaymentMethod.ACH, isRecurring: true, recurrenceInterval: "MONTHLY", status: DonationStatus.COMPLETED },
      { memberId: elder.id, fundId: building.id, amountCents: 100000, paymentMethod: PaymentMethod.CARD, status: DonationStatus.COMPLETED },
      { memberId: kwame.id, fundId: missions.id, amountCents: 25000, paymentMethod: PaymentMethod.CARD, isRecurring: true, recurrenceInterval: "MONTHLY", status: DonationStatus.COMPLETED },
      { memberId: esther.id, fundId: tithe.id, amountCents: 15000, paymentMethod: PaymentMethod.APPLE_PAY, status: DonationStatus.COMPLETED },
    ],
  });

  // ── Small Groups ──────────────────────────────────────────
  const choir = await prisma.smallGroup.create({ data: { name: "Choir", type: GroupType.CHOIR, leaderId: akua.id, isActive: true } });
  const womensFellowship = await prisma.smallGroup.create({ data: { name: "Women's Fellowship", type: GroupType.SMALL_GROUP, leaderId: esther.id, isActive: true } });

  await prisma.groupMember.createMany({
    data: [
      { groupId: choir.id, memberId: akua.id, role: "LEADER" },
      { groupId: choir.id, memberId: kwame.id, role: "MEMBER" },
      { groupId: womensFellowship.id, memberId: esther.id, role: "LEADER" },
    ],
  });

  // ── Events ────────────────────────────────────────────────
  const sundayService = await prisma.event.create({ data: { title: "Resurrection Sunday Morning Service", type: EventType.SERVICE, isRecurring: true, createdById: elder.id } });
  const instance = await prisma.eventInstance.create({ data: { eventId: sundayService.id, startsAt: new Date("2026-05-25T10:00:00"), endsAt: new Date("2026-05-25T12:00:00"), location: "Main Sanctuary" } });

  await prisma.attendance.createMany({
    data: [
      { eventInstanceId: instance.id, memberId: akua.id, checkInMethod: "QR" },
      { eventInstanceId: instance.id, memberId: elder.id, checkInMethod: "QR" },
      { eventInstanceId: instance.id, memberId: esther.id, checkInMethod: "MANUAL" },
      { eventInstanceId: instance.id, memberId: kwame.id, checkInMethod: "QR" },
    ],
  });

  console.log("✅ Seed complete");
  console.log(`   ${4} households, ${4} members, ${4} funds, ${2} groups, ${1} event`);
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
