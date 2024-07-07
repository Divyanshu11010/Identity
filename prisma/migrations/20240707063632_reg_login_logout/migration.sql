-- CreateTable
CREATE TABLE "Dentist" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Dentist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lab" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authToken" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "type" TEXT NOT NULL,
    "dentistID" INTEGER,
    "labID" INTEGER,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_id_key" ON "Dentist"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_username_key" ON "Dentist"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_email_key" ON "Dentist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_contact_key" ON "Dentist"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "Lab_id_key" ON "Lab"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Lab_username_key" ON "Lab"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Lab_email_key" ON "Lab"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lab_contact_key" ON "Lab"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "Token_authToken_key" ON "Token"("authToken");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_dentistID_fkey" FOREIGN KEY ("dentistID") REFERENCES "Dentist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_labID_fkey" FOREIGN KEY ("labID") REFERENCES "Lab"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add the email format constraint for Dentist
ALTER TABLE "Dentist"
ADD CONSTRAINT "email_format_dentist" CHECK ("email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Add the phone number format constraint for Dentist
ALTER TABLE "Dentist"
ADD CONSTRAINT "phone_format_dentist" CHECK ("contact" ~ '^[6-9]\d{9}$');

-- Add the email format constraint for Lab
ALTER TABLE "Lab"
ADD CONSTRAINT "email_format_lab" CHECK ("email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Add the phone number format constraint for Lab
ALTER TABLE "Lab"
ADD CONSTRAINT "phone_format_lab" CHECK ("contact" ~ '^[6-9]\d{9}$');

-- Password constraint
ALTER TABLE "Dentist"
ADD CONSTRAINT "complexity_check" CHECK (
        -- Check for at least one uppercase letter
        Password ~ '[A-Z]' AND
        -- Check for at least one lowercase letter
        Password ~ '[a-z]' AND
        -- Check for at least one special character (you can customize this list)
        Password ~ '[!@#$%^&*()-=_+[\]{};:"|,.<>/?]' AND
        -- Check for at least one digit
        Password ~ '[0-9]'
    );

-- Password constraint
ALTER TABLE "Lab"
ADD CONSTRAINT "complexity_check" CHECK (
        -- Check for at least one uppercase letter
        Password ~ '[A-Z]' AND
        -- Check for at least one lowercase letter
        Password ~ '[a-z]' AND
        -- Check for at least one special character (you can customize this list)
        Password ~ '[!@#$%^&*()-=_+[\]{};:"|,.<>/?]' AND
        -- Check for at least one digit
        Password ~ '[0-9]'
    );