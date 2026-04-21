-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'TWITTER', 'LINKEDIN', 'PINTEREST');

-- CreateEnum
CREATE TYPE "Niche" AS ENUM ('BEAUTY', 'FASHION', 'TECH', 'FOOD', 'TRAVEL', 'FITNESS', 'GAMING', 'LIFESTYLE', 'PARENTING', 'FINANCE', 'EDUCATION', 'OTHER');

-- CreateEnum
CREATE TYPE "CreatorLevel" AS ENUM ('NANO', 'MICRO', 'MACRO', 'MEGA');

-- CreateEnum
CREATE TYPE "VettingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BrandCategory" AS ENUM ('BEAUTY', 'FASHION', 'TECH', 'FOOD', 'SPORT', 'HEALTH', 'HOME', 'TRAVEL', 'FINANCE', 'EDUCATION', 'OTHER');

-- CreateTable
CREATE TABLE "creators" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT,
    "location" TEXT,
    "level" "CreatorLevel" NOT NULL DEFAULT 'NANO',
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creator_platforms" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "handle" TEXT NOT NULL,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "avg_views" INTEGER NOT NULL DEFAULT 0,
    "engagement_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "creator_platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creator_niches" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "niche" "Niche" NOT NULL,

    CONSTRAINT "creator_niches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_items" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "platform" "Platform",
    "views" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vettings" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "status" "VettingStatus" NOT NULL DEFAULT 'PENDING',
    "reviewed_by" TEXT,
    "comment" TEXT,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "agency_user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "website" TEXT,
    "category" "BrandCategory" NOT NULL,
    "legal_name" TEXT,
    "vat_number" TEXT,
    "country" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_products" (
    "id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brand_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creators_user_id_key" ON "creators"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "creators_username_key" ON "creators"("username");

-- CreateIndex
CREATE UNIQUE INDEX "creator_platforms_creator_id_platform_key" ON "creator_platforms"("creator_id", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "creator_niches_creator_id_niche_key" ON "creator_niches"("creator_id", "niche");

-- CreateIndex
CREATE UNIQUE INDEX "vettings_creator_id_key" ON "vettings"("creator_id");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- AddForeignKey
ALTER TABLE "creator_platforms" ADD CONSTRAINT "creator_platforms_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creator_niches" ADD CONSTRAINT "creator_niches_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vettings" ADD CONSTRAINT "vettings_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand_products" ADD CONSTRAINT "brand_products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;
