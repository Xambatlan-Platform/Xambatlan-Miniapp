import { PrismaClient, ProfileType, PriceModel, BadgeType } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create service categories
  console.log('📂 Creating service categories...');
  const categories = [
    {
      slug: 'construccion',
      name: 'Construction & Building',
      nameEs: 'Construcción y Albañilería',
      description: 'Construction, masonry, plumbing, electrical work',
      iconUrl: '🏗️',
    },
    {
      slug: 'limpieza',
      name: 'Cleaning Services',
      nameEs: 'Servicios de Limpieza',
      description: 'House cleaning, office cleaning, deep cleaning',
      iconUrl: '🧹',
    },
    {
      slug: 'tecnologia',
      name: 'Technology & IT',
      nameEs: 'Tecnología e Informática',
      description: 'Computer repair, web development, tech support',
      iconUrl: '💻',
    },
    {
      slug: 'jardineria',
      name: 'Gardening & Landscaping',
      nameEs: 'Jardinería y Paisajismo',
      description: 'Garden maintenance, landscaping, plant care',
      iconUrl: '🌱',
    },
    {
      slug: 'transporte',
      name: 'Transportation',
      nameEs: 'Transporte',
      description: 'Delivery, moving services, personal transport',
      iconUrl: '🚚',
    },
    {
      slug: 'educacion',
      name: 'Education & Tutoring',
      nameEs: 'Educación y Tutorías',
      description: 'Private tutoring, language lessons, skill teaching',
      iconUrl: '📚',
    },
    {
      slug: 'cocina',
      name: 'Cooking & Catering',
      nameEs: 'Cocina y Catering',
      description: 'Personal chef, event catering, meal prep',
      iconUrl: '👨‍🍳',
    },
    {
      slug: 'belleza',
      name: 'Beauty & Wellness',
      nameEs: 'Belleza y Bienestar',
      description: 'Hair styling, massage, beauty treatments',
      iconUrl: '💄',
    },
  ];

  for (const category of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: { ...category, sortOrder: categories.indexOf(category) },
    });
  }

  // Create mock users and profiles for development
  if (process.env.NODE_ENV === 'development') {
    console.log('👥 Creating mock users and profiles...');

    // Mock World ID hashes (in real app, these come from World ID verification)
    const mockUsers = [
      {
        worldIdHash: createHash('sha256').update('user1').digest('hex'),
        profile: {
          type: ProfileType.PROVIDER,
          username: 'maria_constructor',
          avatarEmoji: '👷‍♀️',
          bio: 'Experienced construction worker with 10+ years in residential building. Specializing in masonry and general repairs.',
          contactHash: createHash('sha256').update('contact1').digest('hex'),
          contactCiphertext: 'encrypted_contact_data_1',
          reputationScore: 4.8,
          totalReviews: 47,
        },
        services: [
          {
            category: 'construccion',
            title: 'House Repairs & Masonry',
            description: 'Professional house repairs, wall building, concrete work, and general masonry services. Available for both small fixes and major renovations.',
            priceModel: PriceModel.HOURLY,
            price: 25.0,
            currency: 'USDC',
          },
        ],
      },
      {
        worldIdHash: createHash('sha256').update('user2').digest('hex'),
        profile: {
          type: ProfileType.PROVIDER,
          username: 'carlos_tech',
          avatarEmoji: '👨‍💻',
          bio: 'Full-stack developer and IT consultant. Helping small businesses with their technology needs.',
          contactHash: createHash('sha256').update('contact2').digest('hex'),
          contactCiphertext: 'encrypted_contact_data_2',
          reputationScore: 4.9,
          totalReviews: 23,
        },
        services: [
          {
            category: 'tecnologia',
            title: 'Web Development & IT Support',
            description: 'Custom websites, e-commerce solutions, and ongoing IT support for small businesses. React, Node.js, and database expertise.',
            priceModel: PriceModel.FIXED,
            price: 500.0,
            currency: 'USDC',
          },
        ],
      },
      {
        worldIdHash: createHash('sha256').update('user3').digest('hex'),
        profile: {
          type: ProfileType.PROVIDER,
          username: 'ana_limpieza',
          avatarEmoji: '🧽',
          bio: 'Professional cleaning service with eco-friendly products. Residential and commercial cleaning.',
          contactHash: createHash('sha256').update('contact3').digest('hex'),
          contactCiphertext: 'encrypted_contact_data_3',
          reputationScore: 4.7,
          totalReviews: 89,
        },
        services: [
          {
            category: 'limpieza',
            title: 'Eco-Friendly House Cleaning',
            description: 'Deep cleaning services using environmentally safe products. Regular maintenance or one-time deep cleans available.',
            priceModel: PriceModel.HOURLY,
            price: 18.0,
            currency: 'USDC',
          },
        ],
      },
      {
        worldIdHash: createHash('sha256').update('user4').digest('hex'),
        profile: {
          type: ProfileType.CLIENT,
          username: 'jorge_client',
          avatarEmoji: '🏠',
          bio: 'Homeowner looking for reliable service providers for various household projects.',
          contactHash: createHash('sha256').update('contact4').digest('hex'),
          contactCiphertext: 'encrypted_contact_data_4',
          reputationScore: 4.5,
          totalReviews: 12,
        },
        services: [],
      },
    ];

    for (const userData of mockUsers) {
      const user = await prisma.user.upsert({
        where: { worldIdHash: userData.worldIdHash },
        update: {},
        create: {
          worldIdHash: userData.worldIdHash,
        },
      });

      // Create profile
      const profile = await prisma.profile.upsert({
        where: { userId: user.id },
        update: userData.profile,
        create: {
          ...userData.profile,
          userId: user.id,
        },
      });

      // Create services for providers
      if (userData.profile.type === ProfileType.PROVIDER && userData.services.length > 0) {
        for (const serviceData of userData.services) {
          const service = await prisma.service.upsert({
            where: {
              ownerId_title: {
                ownerId: user.id,
                title: serviceData.title,
              }
            },
            update: serviceData,
            create: {
              ...serviceData,
              ownerId: user.id,
            },
          });

          // Add availability slots
          await prisma.availabilitySlot.createMany({
            data: [
              {
                serviceId: service.id,
                dayOfWeek: 1, // Monday
                startTime: '08:00',
                endTime: '17:00',
                timezone: 'America/Mexico_City',
              },
              {
                serviceId: service.id,
                dayOfWeek: 2, // Tuesday
                startTime: '08:00',
                endTime: '17:00',
                timezone: 'America/Mexico_City',
              },
              {
                serviceId: service.id,
                dayOfWeek: 3, // Wednesday
                startTime: '08:00',
                endTime: '17:00',
                timezone: 'America/Mexico_City',
              },
              {
                serviceId: service.id,
                dayOfWeek: 4, // Thursday
                startTime: '08:00',
                endTime: '17:00',
                timezone: 'America/Mexico_City',
              },
              {
                serviceId: service.id,
                dayOfWeek: 5, // Friday
                startTime: '08:00',
                endTime: '17:00',
                timezone: 'America/Mexico_City',
              },
              {
                serviceId: service.id,
                dayOfWeek: 6, // Saturday
                startTime: '09:00',
                endTime: '14:00',
                timezone: 'America/Mexico_City',
              },
            ],
            skipDuplicates: true,
          });
        }

        // Award some badges to providers
        const badges = [
          {
            userId: user.id,
            kind: BadgeType.VERIFIED_PROVIDER,
            title: 'Verified Provider',
            description: 'Identity verified through World ID',
          },
          {
            userId: user.id,
            kind: BadgeType.EARLY_ADOPTER,
            title: 'Early Adopter',
            description: 'One of the first providers on Xambatlán',
          },
        ];

        if (userData.profile.reputationScore >= 4.8) {
          badges.push({
            userId: user.id,
            kind: BadgeType.TOP_RATED,
            title: 'Top Rated',
            description: 'Maintains excellent ratings from clients',
          });
        }

        for (const badge of badges) {
          await prisma.badge.upsert({
            where: {
              userId_kind: {
                userId: badge.userId,
                kind: badge.kind,
              },
            },
            update: {},
            create: badge,
          });
        }
      }
    }

    console.log('🎉 Development seed data created successfully!');
  }

  console.log('✅ Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });