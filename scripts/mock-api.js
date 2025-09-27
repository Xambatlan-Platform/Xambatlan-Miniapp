#!/usr/bin/env node

// Mock API Server for Xambatlán Frontend Testing
// Provides fake data without requiring real database or contracts

import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockUsers = new Map();
const mockProfiles = new Map();
const mockServices = new Map();
const mockReviews = new Map();
const mockDeals = new Map();
const mockRevealRequests = new Map();

// Helper to generate fake data
const generateId = () => crypto.randomBytes(16).toString('hex');
const generateToken = () => 'mock_jwt_' + crypto.randomBytes(32).toString('hex');

// Initialize with some fake data
const initMockData = () => {
  // Mock profiles
  const mockProfilesData = [
    {
      id: 'profile_1',
      userId: 'user_1',
      type: 'PROVIDER',
      username: 'maria_constructor',
      avatarEmoji: '👷‍♀️',
      bio: 'Experienced construction worker with 10+ years in residential building.',
      reputationScore: 4.8,
      totalReviews: 47,
      badges: [
        { kind: 'VERIFIED_PROVIDER', title: 'Verified Provider', iconUrl: '✅' },
        { kind: 'TOP_RATED', title: 'Top Rated', iconUrl: '⭐' }
      ]
    },
    {
      id: 'profile_2',
      userId: 'user_2',
      type: 'PROVIDER',
      username: 'carlos_tech',
      avatarEmoji: '👨‍💻',
      bio: 'Full-stack developer and IT consultant.',
      reputationScore: 4.9,
      totalReviews: 23,
      badges: [
        { kind: 'VERIFIED_PROVIDER', title: 'Verified Provider', iconUrl: '✅' }
      ]
    },
    {
      id: 'profile_3',
      userId: 'user_3',
      type: 'CLIENT',
      username: 'ana_client',
      avatarEmoji: '🏠',
      bio: 'Homeowner looking for reliable service providers.',
      reputationScore: 4.5,
      totalReviews: 8,
      badges: []
    }
  ];

  mockProfilesData.forEach(profile => mockProfiles.set(profile.id, profile));

  // Mock services
  const mockServicesData = [
    {
      id: 'service_1',
      ownerId: 'user_1',
      category: 'construccion',
      title: 'House Repairs & Masonry',
      description: 'Professional house repairs, wall building, concrete work, and general masonry services.',
      priceModel: 'HOURLY',
      price: 25.0,
      currency: 'USDC',
      active: true,
      provider: mockProfilesData[0],
      availability: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '17:00' },
        { dayOfWeek: 2, startTime: '08:00', endTime: '17:00' }
      ]
    },
    {
      id: 'service_2',
      ownerId: 'user_2',
      category: 'tecnologia',
      title: 'Web Development & IT Support',
      description: 'Custom websites, e-commerce solutions, and ongoing IT support for small businesses.',
      priceModel: 'FIXED',
      price: 500.0,
      currency: 'USDC',
      active: true,
      provider: mockProfilesData[1],
      availability: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' }
      ]
    }
  ];

  mockServicesData.forEach(service => mockServices.set(service.id, service));

  // Mock reviews
  const mockReviewsData = [
    {
      id: 'review_1',
      dealId: 'deal_1',
      fromUserId: 'user_3',
      toUserId: 'user_1',
      rating: 5,
      text: 'Excellent work! Very professional and completed on time.',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'review_2',
      dealId: 'deal_2',
      fromUserId: 'user_1',
      toUserId: 'user_3',
      rating: 4,
      text: 'Great client, clear communication and prompt payment.',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  mockReviewsData.forEach(review => mockReviews.set(review.id, review));
};

// Initialize mock data
initMockData();

// Current authenticated user (simulated)
let currentUser = null;

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Mock API Server for Xambatlán Frontend Testing'
  });
});

// Auth endpoints
app.post('/auth/verify', (req, res) => {
  const { proof, nullifier_hash } = req.body;

  // Simulate World ID verification
  setTimeout(() => {
    const userId = generateId();
    const token = generateToken();

    currentUser = {
      id: userId,
      worldIdHash: nullifier_hash || 'mock_nullifier_hash',
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: {
        token,
        user: currentUser,
        isNewUser: true
      }
    });
  }, 1000); // Simulate network delay
});

// Profile endpoints
app.get('/profiles/me', (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Return first profile or null if none exists
  const userProfile = Array.from(mockProfiles.values())[0];
  res.json({ success: true, data: userProfile });
});

app.post('/profiles', (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { type, username, bio, avatarEmoji, contactInfo } = req.body;

  const newProfile = {
    id: generateId(),
    userId: currentUser.id,
    type,
    username,
    avatarEmoji,
    bio,
    contactHash: crypto.createHash('sha256').update(JSON.stringify(contactInfo || {})).digest('hex'),
    reputationScore: 0,
    totalReviews: 0,
    badges: [
      { kind: 'VERIFIED_PROVIDER', title: 'Verified Provider', iconUrl: '✅' },
      { kind: 'NEWCOMER', title: 'Newcomer', iconUrl: '🌟' }
    ],
    createdAt: new Date().toISOString()
  };

  mockProfiles.set(newProfile.id, newProfile);

  res.json({ success: true, data: newProfile });
});

app.get('/profiles', (req, res) => {
  const { type, limit = 20, offset = 0 } = req.query;

  let profiles = Array.from(mockProfiles.values());

  if (type) {
    profiles = profiles.filter(p => p.type === type.toUpperCase());
  }

  const total = profiles.length;
  const items = profiles.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    success: true,
    data: {
      items,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < total
    }
  });
});

// Service endpoints
app.get('/services', (req, res) => {
  const { category, limit = 20, offset = 0 } = req.query;

  let services = Array.from(mockServices.values());

  if (category) {
    services = services.filter(s => s.category === category);
  }

  const total = services.length;
  const items = services.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    success: true,
    data: {
      items,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < total
    }
  });
});

app.post('/services', (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { category, title, description, priceModel, price, availability } = req.body;

  const newService = {
    id: generateId(),
    ownerId: currentUser.id,
    category,
    title,
    description,
    priceModel,
    price,
    currency: 'USDC',
    active: true,
    availability: availability || [],
    createdAt: new Date().toISOString()
  };

  mockServices.set(newService.id, newService);

  res.json({ success: true, data: newService });
});

app.get('/services/:id', (req, res) => {
  const service = mockServices.get(req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json({ success: true, data: service });
});

// Reveal endpoints
app.post('/reveal/:serviceId/request', (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { serviceId } = req.params;
  const { paymentProof, message } = req.body;

  const service = mockServices.get(serviceId);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const revealRequest = {
    id: generateId(),
    serviceId,
    clientId: currentUser.id,
    providerId: service.ownerId,
    status: 'PENDING',
    paymentRef: paymentProof || 'mock_payment_' + generateId(),
    message,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
    createdAt: new Date().toISOString()
  };

  mockRevealRequests.set(revealRequest.id, revealRequest);

  res.json({ success: true, data: revealRequest });
});

app.post('/reveal/:requestId/consent', (req, res) => {
  const { requestId } = req.params;
  const { signature, signedMessage, consent } = req.body;

  const revealRequest = mockRevealRequests.get(requestId);
  if (!revealRequest) {
    return res.status(404).json({ error: 'Reveal request not found' });
  }

  revealRequest.status = consent ? 'APPROVED' : 'DENIED';
  revealRequest.consentSignature = signature;
  revealRequest.consentMessage = signedMessage;

  if (consent) {
    revealRequest.accessToken = 'mock_access_' + generateId();
  }

  res.json({
    success: true,
    data: {
      status: revealRequest.status,
      accessToken: revealRequest.accessToken,
      expiresAt: revealRequest.expiresAt
    }
  });
});

app.get('/reveal/:requestId/contact', (req, res) => {
  const { requestId } = req.params;
  const { token } = req.query;

  const revealRequest = mockRevealRequests.get(requestId);
  if (!revealRequest || revealRequest.status !== 'APPROVED') {
    return res.status(404).json({ error: 'Invalid reveal request' });
  }

  if (token !== revealRequest.accessToken) {
    return res.status(401).json({ error: 'Invalid access token' });
  }

  // Mock contact info
  const contactInfo = {
    whatsapp: '+1234567890',
    email: 'provider@example.com',
    website: 'https://provider-website.com'
  };

  res.json({ success: true, data: contactInfo });
});

// Deal endpoints
app.post('/deals', (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { serviceId, onChain, amount, currency } = req.body;

  const service = mockServices.get(serviceId);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const newDeal = {
    id: generateId(),
    serviceId,
    clientId: currentUser.id,
    providerId: service.ownerId,
    onChain,
    amount,
    currency: currency || 'USDC',
    status: 'PENDING',
    escrowTx: onChain ? 'mock_tx_' + generateId() : null,
    createdAt: new Date().toISOString()
  };

  mockDeals.set(newDeal.id, newDeal);

  res.json({ success: true, data: newDeal });
});

app.get('/deals', (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const deals = Array.from(mockDeals.values())
    .filter(deal => deal.clientId === currentUser.id || deal.providerId === currentUser.id);

  res.json({
    success: true,
    data: {
      items: deals,
      total: deals.length
    }
  });
});

// Review endpoints
app.post('/reviews', (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { dealId, toUserId, rating, text } = req.body;

  const newReview = {
    id: generateId(),
    dealId,
    fromUserId: currentUser.id,
    toUserId,
    rating,
    text,
    createdAt: new Date().toISOString()
  };

  mockReviews.set(newReview.id, newReview);

  res.json({ success: true, data: newReview });
});

app.get('/reviews/:profileId', (req, res) => {
  const { profileId } = req.params;

  const reviews = Array.from(mockReviews.values())
    .filter(review => review.toUserId === profileId);

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  res.json({
    success: true,
    data: {
      reviews,
      total: reviews.length,
      averageRating,
      ratingDistribution: {
        '5': reviews.filter(r => r.rating === 5).length,
        '4': reviews.filter(r => r.rating === 4).length,
        '3': reviews.filter(r => r.rating === 3).length,
        '2': reviews.filter(r => r.rating === 2).length,
        '1': reviews.filter(r => r.rating === 1).length
      }
    }
  });
});

// Service categories
app.get('/categories', (req, res) => {
  const categories = [
    {
      id: 'cat_1',
      slug: 'construccion',
      name: 'Construction & Building',
      nameEs: 'Construcción y Albañilería',
      iconUrl: '🏗️',
      active: true
    },
    {
      id: 'cat_2',
      slug: 'tecnologia',
      name: 'Technology & IT',
      nameEs: 'Tecnología e Informática',
      iconUrl: '💻',
      active: true
    },
    {
      id: 'cat_3',
      slug: 'limpieza',
      name: 'Cleaning Services',
      nameEs: 'Servicios de Limpieza',
      iconUrl: '🧹',
      active: true
    },
    {
      id: 'cat_4',
      slug: 'jardineria',
      name: 'Gardening & Landscaping',
      nameEs: 'Jardinería y Paisajismo',
      iconUrl: '🌱',
      active: true
    }
  ];

  res.json({ success: true, data: categories });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Mock API: ${req.method} ${req.path} not implemented`
  });
});

app.use((error, req, res, next) => {
  console.error('Mock API Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🧪 Mock API Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /auth/verify - World ID verification`);
  console.log(`   GET  /profiles/me - Current user profile`);
  console.log(`   POST /profiles - Create profile`);
  console.log(`   GET  /services - List services`);
  console.log(`   POST /services - Create service`);
  console.log(`   POST /reveal/:serviceId/request - Request contact reveal`);
  console.log(`   POST /reveal/:requestId/consent - Provider consent`);
  console.log(`   GET  /reveal/:requestId/contact - Get revealed contact`);
  console.log(`   POST /deals - Create deal`);
  console.log(`   GET  /deals - List deals`);
  console.log(`   POST /reviews - Submit review`);
  console.log(`   GET  /categories - Service categories`);
  console.log(`🌐 Ready for frontend testing!`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Mock API Server shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Mock API Server shutting down...');
  process.exit(0);
});