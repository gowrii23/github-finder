/**
 * Company watchlist — ATS public APIs.
 * Slugs verified where possible; 404s are skipped gracefully.
 */
module.exports = [
  // India / remote-friendly — Greenhouse
  { name: 'Freshworks', type: 'greenhouse', slug: 'freshworks' },
  { name: 'Chargebee', type: 'greenhouse', slug: 'chargebee' },
  { name: 'Razorpay', type: 'greenhouse', slug: 'razorpay' },
  { name: 'Postman', type: 'greenhouse', slug: 'postman' },
  { name: 'Groww', type: 'greenhouse', slug: 'groww' },
  { name: 'PhonePe', type: 'greenhouse', slug: 'phonepe' },
  { name: 'Juspay', type: 'greenhouse', slug: 'juspay' },
  { name: 'HyperVerge', type: 'greenhouse', slug: 'hyperverge' },

  // Global remote-friendly — Greenhouse
  { name: 'GitLab', type: 'greenhouse', slug: 'gitlab' },
  { name: 'Atlassian', type: 'greenhouse', slug: 'atlassian' },
  { name: 'Hashicorp', type: 'greenhouse', slug: 'hashicorp' },

  // Lever
  { name: 'Zoho', type: 'lever', slug: 'zoho' },
  { name: 'CRED', type: 'lever', slug: 'cred' },
  { name: 'Swiggy', type: 'lever', slug: 'swiggy' },

  // Ashby (AI startups)
  { name: 'Facilio', type: 'ashby', slug: 'facilio' },
  { name: 'Cohere', type: 'ashby', slug: 'cohere' },
  { name: 'Sierra', type: 'ashby', slug: 'sierra' },
];
