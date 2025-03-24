// Sample data for the Franchise Tracker

// Lead data
const leadsData = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "(303) 555-1234",
        location: "Denver, CO",
        source: "website",
        status: "new",
        createdDate: "2025-03-10",
        notes: "Interested in opening a location in downtown Denver."
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "(480) 555-5678",
        location: "Phoenix, AZ",
        source: "referral",
        status: "contacted",
        createdDate: "2025-03-05",
        notes: "Referred by existing franchisee. Has experience in food industry."
    },
    {
        id: 3,
        name: "Michael Brown",
        email: "michael.brown@example.com",
        phone: "(702) 555-9012",
        location: "Las Vegas, NV",
        source: "social",
        status: "qualified",
        createdDate: "2025-02-28",
        notes: "Very interested. Has capital ready for investment."
    },
    {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        phone: "(512) 555-3456",
        location: "Austin, TX",
        source: "event",
        status: "unqualified",
        createdDate: "2025-02-20",
        notes: "Met at franchise expo. Limited budget."
    },
    {
        id: 5,
        name: "David Wilson",
        email: "david.wilson@example.com",
        phone: "(206) 555-7890",
        location: "Seattle, WA",
        source: "website",
        status: "contacted",
        createdDate: "2025-03-15",
        notes: "Second contact attempt made. Awaiting response."
    },
    {
        id: 6,
        name: "Jennifer Martinez",
        email: "jennifer.m@example.com",
        phone: "(619) 555-2345",
        location: "San Diego, CA",
        source: "referral",
        status: "qualified",
        createdDate: "2025-03-08",
        notes: "Has multiple retail locations already. High potential."
    }
];

// Sales pipeline data
const pipelineData = {
    "initial-contact": [
        {
            id: 101,
            name: "Robert Taylor",
            location: "Portland, OR",
            date: "2025-03-22",
            notes: "Initial email sent, awaiting response"
        },
        {
            id: 102,
            name: "Lisa Anderson",
            location: "Chicago, IL",
            date: "2025-03-21",
            notes: "Left voicemail, will follow up in 2 days"
        }
    ],
    "sales-call": [
        {
            id: 201,
            name: "Thomas White",
            location: "Miami, FL",
            date: "2025-03-20",
            notes: "Call scheduled for March 26"
        },
        {
            id: 202,
            name: "Amanda Clark",
            location: "Atlanta, GA",
            date: "2025-03-19",
            notes: "Initial call completed, sent information package"
        }
    ],
    "follow-up": [
        {
            id: 301,
            name: "Sarah Johnson",
            location: "Phoenix, AZ",
            date: "2025-03-18",
            notes: "Follow-up call scheduled for March 25"
        },
        {
            id: 302,
            name: "David Wilson",
            location: "Seattle, WA",
            date: "2025-03-17",
            notes: "Sent additional market analysis as requested"
        }
    ],
    "negotiation": [
        {
            id: 401,
            name: "Jennifer Martinez",
            location: "San Diego, CA",
            date: "2025-03-15",
            notes: "Discussing territory options and financial terms"
        }
    ],
    "closed-won": [
        {
            id: 501,
            name: "Michael Brown",
            location: "Las Vegas, NV",
            date: "2025-03-10",
            notes: "Agreement signed, moving to onboarding"
        },
        {
            id: 502,
            name: "James Wilson",
            location: "Salt Lake City, UT",
            date: "2025-03-05",
            notes: "Wire transfer received, scheduled onboarding call"
        }
    ]
};

// Development tracker data
const developmentData = [
    {
        id: 1001,
        name: "Michael Brown",
        location: "Las Vegas, NV",
        agreementDate: "2025-03-10",
        currentStage: "payment",
        progress: 20,
        stages: [
            { name: "Agreement Signed", status: "completed", date: "2025-03-10" },
            { name: "Wire Transfer", status: "current", date: "" },
            { name: "Onboarding Call", status: "pending", date: "" },
            { name: "Training", status: "pending", date: "" },
            { name: "Construction", status: "pending", date: "" },
            { name: "Equipment Purchase", status: "pending", date: "" },
            { name: "Store Opening", status: "pending", date: "" }
        ],
        notes: "Wire transfer in process, expected to clear by March 28"
    },
    {
        id: 1002,
        name: "James Wilson",
        location: "Salt Lake City, UT",
        agreementDate: "2025-03-05",
        currentStage: "onboarding",
        progress: 30,
        stages: [
            { name: "Agreement Signed", status: "completed", date: "2025-03-05" },
            { name: "Wire Transfer", status: "completed", date: "2025-03-12" },
            { name: "Onboarding Call", status: "current", date: "" },
            { name: "Training", status: "pending", date: "" },
            { name: "Construction", status: "pending", date: "" },
            { name: "Equipment Purchase", status: "pending", date: "" },
            { name: "Store Opening", status: "pending", date: "" }
        ],
        notes: "Onboarding call scheduled for March 29"
    },
    {
        id: 1003,
        name: "Patricia Moore",
        location: "Nashville, TN",
        agreementDate: "2025-02-15",
        currentStage: "training",
        progress: 45,
        stages: [
            { name: "Agreement Signed", status: "completed", date: "2025-02-15" },
            { name: "Wire Transfer", status: "completed", date: "2025-02-20" },
            { name: "Onboarding Call", status: "completed", date: "2025-02-28" },
            { name: "Training", status: "current", date: "" },
            { name: "Construction", status: "pending", date: "" },
            { name: "Equipment Purchase", status: "pending", date: "" },
            { name: "Store Opening", status: "pending", date: "" }
        ],
        notes: "Training scheduled for April 5-10"
    },
    {
        id: 1004,
        name: "Richard Garcia",
        location: "Albuquerque, NM",
        agreementDate: "2025-01-20",
        currentStage: "construction",
        progress: 65,
        stages: [
            { name: "Agreement Signed", status: "completed", date: "2025-01-20" },
            { name: "Wire Transfer", status: "completed", date: "2025-01-25" },
            { name: "Onboarding Call", status: "completed", date: "2025-02-01" },
            { name: "Training", status: "completed", date: "2025-02-15" },
            { name: "Construction", status: "current", date: "" },
            { name: "Equipment Purchase", status: "pending", date: "" },
            { name: "Store Opening", status: "pending", date: "" }
        ],
        notes: "Construction permits approved, work begins April 1"
    },
    {
        id: 1005,
        name: "Elizabeth Taylor",
        location: "Charlotte, NC",
        agreementDate: "2024-12-10",
        currentStage: "equipment",
        progress: 80,
        stages: [
            { name: "Agreement Signed", status: "completed", date: "2024-12-10" },
            { name: "Wire Transfer", status: "completed", date: "2024-12-15" },
            { name: "Onboarding Call", status: "completed", date: "2024-12-20" },
            { name: "Training", status: "completed", date: "2025-01-10" },
            { name: "Construction", status: "completed", date: "2025-03-01" },
            { name: "Equipment Purchase", status: "current", date: "" },
            { name: "Store Opening", status: "pending", date: "" }
        ],
        notes: "Equipment ordered, delivery expected by April 15"
    },
    {
        id: 1006,
        name: "Kevin Johnson",
        location: "Tulsa, OK",
        agreementDate: "2024-11-05",
        currentStage: "opening",
        progress: 95,
        stages: [
            { name: "Agreement Signed", status: "completed", date: "2024-11-05" },
            { name: "Wire Transfer", status: "completed", date: "2024-11-10" },
            { name: "Onboarding Call", status: "completed", date: "2024-11-15" },
            { name: "Training", status: "completed", date: "2024-12-01" },
            { name: "Construction", status: "completed", date: "2025-02-01" },
            { name: "Equipment Purchase", status: "completed", date: "2025-03-01" },
            { name: "Store Opening", status: "current", date: "" }
        ],
        notes: "Final inspections passed, grand opening scheduled for April 10"
    }
];

// Chart data
const chartData = {
    pipeline: {
        labels: ['Initial Contact', 'Sales Call', 'Follow-up', 'Negotiation', 'Closed Won'],
        data: [2, 2, 2, 1, 2]
    },
    development: {
        labels: ['Agreement', 'Payment', 'Onboarding', 'Training', 'Construction', 'Equipment', 'Opening'],
        data: [6, 6, 5, 4, 3, 2, 1]
    }
};
