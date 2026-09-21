import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { prisma } from "../src/lib/prisma";

const SLUG_MAPPINGS: { id: string; oldSlug: string; newSlug: string }[] = [
  {
    id: "cmtd035zf0014qm0kx7p5wlk3",
    oldSlug: "slugcalista-pink-womens-body-splash",
    newSlug: "calista-pink-womens-body-splash",
  },
  {
    id: "cmtssnat5000rqy0kw8n6um0g",
    oldSlug: "sharel: sharel-splendor-deodorant-spray",
    newSlug: "sharel-splendor-deodorant-spray",
  },
  {
    id: "cmtixtyqe0001po0kunqmiddq",
    oldSlug: "لdove-women-deodorant-spray-150ml",
    newSlug: "dove-women-deodorant-spray-150ml",
  },
  {
    id: "cmtj31pv00004po0k0homil2m",
    oldSlug: "bold-volumerimel-kalista-bold-volume 🧡",
    newSlug: "rimel-kalista-bold-volume-orange",
  },
  {
    id: "cmtr0xde2000amv0khqqdmwi4",
    oldSlug: "Zoppini Eyebrow Lift Gel",
    newSlug: "zoppini-eyebrow-lift-gel",
  },
  {
    id: "cmtx7op7t002ro20k8fw3wwy6",
    oldSlug: ": ellaro-sulfate-free-shampoo-dry-colored-hair",
    newSlug: "ellaro-sulfate-free-shampoo-dry-colored-hair",
  },
  {
    id: "cmu3tjqve000rs30k4tyw3mih",
    oldSlug: "\u200Bultra-mini-perfume-30ml",
    newSlug: "ultra-mini-perfume-30ml",
  },
  {
    id: "cmu4b5io2003ws30kzbmttoep",
    oldSlug: "\u200Bbiol-biscuit-hair-ice-cream",
    newSlug: "biol-biscuit-hair-ice-cream",
  },
  {
    id: "cmu46vsko002zs30k1b0l788s",
    oldSlug: "\u200Bbutterfly-5-in-1-moisture-cream",
    newSlug: "butterfly-5-in-1-moisture-cream",
  },
  {
    id: "cmu8mt0l50004l40k96fw9dgw",
    oldSlug: "\u200Bbody-care-perfumed-body-spray",
    newSlug: "body-care-perfumed-body-spray",
  },
  {
    id: "cmubd53e10001l40k90fnaw1x",
    oldSlug: "\u200Bstacy-mens-hair-color-kit",
    newSlug: "stacy-mens-hair-color-kit",
  },
  {
    id: "cmtv1wcw8000yo20kz43kg71v",
    oldSlug: "Caspian-hair-spray-150ml",
    newSlug: "caspian-hair-spray-150ml",
  },
  {
    id: "cmtv1ppee000to20kh26jnzkh",
    oldSlug: "Caspian-hair-spray-250mil",
    newSlug: "caspian-hair-spray-250mil",
  },
  {
    id: "cmtv2gqhh001co20khz5j0u3z",
    oldSlug: "With-you-french-vanilla-body-cream",
    newSlug: "with-you-french-vanilla-body-cream",
  },
  {
    id: "cmu33dg2x001as20k14tez1cr",
    oldSlug: "Note-new-era-foundation-spf50",
    newSlug: "note-new-era-foundation-spf50",
  },
  {
    id: "cmtkjnv4f000gpo0k2g01kbo4",
    oldSlug: "انبر-کاشت-مژه-زد-وان-z-one",
    newSlug: "anbar-kasht-mozheh-z-one",
  },
];

async function main() {
  console.log("Starting slug cleanup...");

  for (const item of SLUG_MAPPINGS) {
    const existing = await prisma.product.findUnique({
      where: { id: item.id },
      select: { id: true, slug: true, title: true },
    });

    if (!existing) {
      console.log(`Product with id ${item.id} not found.`);
      continue;
    }

    // Check if newSlug is already taken by another product
    const conflict = await prisma.product.findUnique({
      where: { slug: item.newSlug },
      select: { id: true, title: true },
    });

    if (conflict && conflict.id !== item.id) {
      console.error(`Conflict! Slug ${item.newSlug} already belongs to product ${conflict.id}`);
      continue;
    }

    await prisma.product.update({
      where: { id: item.id },
      data: { slug: item.newSlug },
    });

    console.log(`✓ Updated "${existing.title}": "${existing.slug}" -> "${item.newSlug}"`);
  }

  console.log("Slug cleanup completed successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
