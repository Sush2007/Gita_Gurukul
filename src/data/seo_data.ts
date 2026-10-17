// Advanced SEO, GEO & AEO Search Intelligence Architecture for Gita Gurukul

export const SEO_KEYWORDS = [
  // Brand & Founder Authority
  "Gita Gurukul",
  "Gita Gurukul Rishikesh",
  "Papiya Ranabijayini Samal",
  "Papiya Samal Gita",
  "Gita Gurukul Diary",
  "Gita Gurukul Official Website",
  
  // Core Product & Editions
  "Bhagavad Gita diary",
  "27 sacred shlokas diary",
  "Bhagavad Gita daily journal",
  "Gita mindfulness diary",
  "guided Gita reflection journal",
  "hardbound Bhagavad Gita notebook",
  "gold embossed Gita diary",
  "Vedic reflection journal 2026",
  "hand bound sacred edition Gita",
  
  // Intent & E-Commerce
  "buy Bhagavad Gita diary online",
  "order Gita Gurukul diary",
  "Bhagavad Gita diary price",
  "spiritual gifts India",
  "best spiritual diary in India",
  "daily shloka habit tracker",
  "Bhagavad Gita journal with English meaning",
  "Krishna consciousness gifts",
  "sacred Hindu gifts online",

  // Vedic Philosophy & Spiritual Practice (AEO)
  "27 transformative shlokas of Gita",
  "how to practice Gita in daily life",
  "daily reflection with Bhagavad Gita",
  "Karma Yoga daily practice",
  "mind control shlokas Gita",
  "calmness and inner peace Gita verses",
  "Bhakti meditation journal",
  "steady intellect Sthitaprajna Gita",
  "authentic Vedic wisdom Rishikesh",
  
  // Seva & Philanthropy
  "Gita Gurukul donation",
  "Gita Jayanti celebration Rishikesh",
  "support spiritual seekers Rishikesh",
  "Gita Gurukul seva",
  "annadanam Rishikesh monks",
  "Vedic text preservation India",

  // Geographic Telemetry (Local SEO & GEO)
  "Rishikesh spiritual ashram",
  "Rishikesh Bhagavad Gita community",
  "Himalayan spiritual wisdom Rishikesh",
  "Uttarakhand Vedic culture",
  "Gautam Buddha Nagar store fulfillment",
];

export const GITA_GURUKUL_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    // 1. Organization Schema
    {
      "@type": "EducationalOrganization",
      "@id": "https://www.gitagurukul.com/#organization",
      "name": "Gita Gurukul",
      "alternateName": ["Gita Gurukul Rishikesh", "Sri Gita Gurukul"],
      "url": "https://www.gitagurukul.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.gitagurukul.com/images/sss_adjusted_1.png",
        "caption": "Gita Gurukul Official Emblem"
      },
      "image": "https://www.gitagurukul.com/images/1_1.png",
      "description": "Gita Gurukul is dedicated to bringing timeless Vedic wisdom and the transformational teachings of the Bhagavad Gita into modern daily lives through guided reflection tools and spiritual seva in Rishikesh.",
      "founder": {
        "@type": "Person",
        "name": "Papiya Ranabijayini Samal",
        "jobTitle": "Founder & Spiritual Curator",
        "description": "Spent over seven years studying the 700+ verses of the Bhagavad Gita to curate the 27 most transformative verses for everyday calmness, focus, and purposeful living."
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Rishikesh",
        "addressRegion": "Uttarakhand",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "30.0869",
        "longitude": "78.2676"
      },
      "email": "gitagurukulm@gmail.com",
      "sameAs": [
        "https://www.gitagurukul.com",
        "https://instagram.com/gitagurukul"
      ]
    },

    // 2. WebSite Schema
    {
      "@type": "WebSite",
      "@id": "https://www.gitagurukul.com/#website",
      "url": "https://www.gitagurukul.com",
      "name": "Gita Gurukul",
      "description": "Eternal Vedic Wisdom for the Modern Seeker",
      "publisher": {
        "@id": "https://www.gitagurukul.com/#organization"
      },
      "inLanguage": "en-IN"
    },

    // 3. Flagship Product Schema (Bhagavad Gita Diary)
    {
      "@type": "Product",
      "@id": "https://www.gitagurukul.com/#product",
      "name": "Gita Gurukul Diary (27 Sacred Shlokas Edition)",
      "alternateName": "Bhagavad Gita Daily Reflection Journal",
      "image": [
        "https://www.gitagurukul.com/images/screenshot_from_2026_07_12_18_39_10_1.png",
        "https://www.gitagurukul.com/images/1_1.png"
      ],
      "description": "Hand-bound sacred Bhagavad Gita diary featuring 27 handpicked shlokas carefully curated by founder Papiya Ranabijayini Samal. Crafted for daily reflection, mindfulness, steady habits, and spiritual poise.",
      "sku": "GG-DIARY-27S",
      "mpn": "GG2026DIARY",
      "brand": {
        "@type": "Brand",
        "name": "Gita Gurukul"
      },
      "category": "Books & Stationery > Daily Planners & Spiritual Journals",
      "material": "Gold-embossed hardbound cover, archival ivory paper",
      "offers": {
        "@type": "Offer",
        "url": "https://www.gitagurukul.com/shop",
        "priceCurrency": "INR",
        "price": "799",
        "priceValidUntil": "2027-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://www.gitagurukul.com/#organization"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "INR"
          },
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "IN"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 2,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 2,
              "maxValue": 5,
              "unitCode": "DAY"
            }
          }
        },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "IN",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": 7,
          "returnMethod": "https://schema.org/ReturnByMail",
          "returnFees": "https://schema.org/FreeReturn"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "142",
        "bestRating": "5",
        "worstRating": "1"
      }
    },

    // 4. FAQPage Schema (AEO for Featured Snippets & AI Overviews)
    {
      "@type": "FAQPage",
      "@id": "https://www.gitagurukul.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the Gita Gurukul Diary?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Gita Gurukul Diary is a beautifully crafted journal containing 27 handpicked shlokas from the Bhagavad Gita. It is designed to help modern seekers practice daily reflection, mindfulness, and integrate ancient Vedic wisdom into their everyday lives."
          }
        },
        {
          "@type": "Question",
          "name": "Why does the diary focus specifically on 27 shlokas?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Founder Papiya Ranabijayini Samal spent seven years studying the 700+ verses of the Bhagavad Gita. Rather than overwhelming readers with an exhaustive volume, she selected the 27 verses that consistently provide the clearest guidance for mastering calmness, mental clarity, and spiritual poise in everyday life."
          }
        },
        {
          "@type": "Question",
          "name": "Where is Gita Gurukul based?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Gita Gurukul's spiritual lineage and roots are centered in the sacred city of Rishikesh, Uttarakhand, in the foothills of the Himalayas. Store fulfillment and express courier dispatch operate through Shiprocket out of Gautam Buddha Nagar, Uttar Pradesh."
          }
        },
        {
          "@type": "Question",
          "name": "What are the shipping charges and delivery timelines?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Delivery is free across India. Orders are dispatched within 24 to 48 hours Monday through Saturday via express couriers (Blue Dart, Delhivery, DTDC, Shadowfax). Orders placed before 2:00 PM qualify for same-day preparation."
          }
        },
        {
          "@type": "Question",
          "name": "How does my purchase or donation support the community?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A direct portion of every purchase and 100% of donations fund community celebrations like Bhagavad Gita Jayanti, sacred yagnyas, and daily support (food, winter clothing, and shelter) for spiritual seekers and monks in Rishikesh."
          }
        },
        {
          "@type": "Question",
          "name": "Can I cancel an order or request a replacement?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, customers can cancel an order directly from their profile page before dispatch. If an item arrives damaged, our support team (gitagurukulm@gmail.com) issues a free replacement within 7 days."
          }
        }
      ]
    },

    // 5. BreadcrumbList Schema
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.gitagurukul.com/#breadcrumbs",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.gitagurukul.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Shop",
          "item": "https://www.gitagurukul.com/shop"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "About Us",
          "item": "https://www.gitagurukul.com/about"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Donations & Seva",
          "item": "https://www.gitagurukul.com/donate"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "FAQ",
          "item": "https://www.gitagurukul.com/faq"
        }
      ]
    }
  ]
};
