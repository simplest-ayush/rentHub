import { Listing, User } from '../models/models';

export const DEMO_USER: User = {
    id: 'demo-user',
    name: 'Demo Landlord',
    email: 'demo@renthub.com',
    password: 'Demo@123',
};

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/500`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

function make(
    n: number,
    o: Partial<Listing> & Pick<Listing, 'title' | 'street' | 'rent'>
): Listing {
    return {
        id: `seed-${n}`,
        ownerId: DEMO_USER.id,
        propertyType: 'Apartment',
        propertyName: `Building ${n}`,
        shared: false,
        sqft: 900,
        beds: 2,
        leaseType: 'long',
        negotiable: false,
        priceMode: 'perMonth',
        furnished: false,
        amenities: [],
        description: 'Bright, well-kept home close to transit, shops and parks. Contact the owner for a viewing.',
        contactName: DEMO_USER.name,
        contactPhone: '9876543210',
        contactEmail: DEMO_USER.email,
        photos: [img(`rent${n}a`), img(`rent${n}b`), img(`rent${n}c`)],
        createdAt: daysAgo(n),
        ...o,
    };
}

export const SEED_LISTINGS: Listing[] = [
    make(1, {
        title: 'Sunny 2BHK near Central Park',
        street: '123 MG Road, Bengaluru, Karnataka',
        rent: 18000,
        sqft: 950,
        furnished: true,
        amenities: [
            'Swimming Pool',
            'Gym/Fitness Center',
            'Car Park'
        ]
    }),
    make(2, {
        title: 'Modern Studio in Downtown',
        street: '45 Park Street, Kolkata, West Bengal',
        rent: 22000,
        sqft: 520,
        furnished: true,
        negotiable: true,
        leaseType: 'short',
        amenities: [
            'Elevator',
            'Laundry Service',
            'Water Heater'
        ]
    }),
    make(3, {
        title: 'Spacious 3BHK with Private Lawn',
        street: '8 Baner Road, Pune, Maharashtra',
        rent: 35000,
        sqft: 1600,
        amenities: [
            'Private Lawn',
            'Car Park',
            'Power Backup'
        ]
    }),
    make(4, {
        title: 'Cozy Shared Room for Students',
        street: '77 North Campus Road, Delhi, India',
        rent: 8000,
        sqft: 300,
        shared: true,
        leaseType: 'both',
        priceMode: 'utilitiesIncluded',
        amenities: [
            'Visitors Parking',
            'Water Heater'
        ]
    }),
    make(5, {
        title: 'Family Apartment in Gated Society',
        street: '22 Whitefield Main Road, Bengaluru, Karnataka',
        rent: 28000,
        sqft: 1300,
        furnished: true,
        amenities: [
            'Club House',
            'Plant Security System',
            'Swimming Pool',
            'Elevator'
        ]
    }),
    make(6, {
        title: 'Budget 1BHK Close to Metro',
        street: '9 Dwarka Sector 10, New Delhi, India',
        rent: 12000,
        sqft: 600,
        negotiable: true,
        amenities: [
            'Garbage Disposal',
            'Water Heater'
        ]
    }),
    make(7, {
        title: 'Luxury Penthouse with City View',
        street: '1 Golf Course Road, Gurugram, Haryana',
        rent: 85000,
        sqft: 2200,
        furnished: true,
        amenities: [
            'Gym/Fitness Center',
            'Swimming Pool',
            'Elevator',
            'Club House',
            'Power Backup'
        ]
    }),
    make(8, {
        title: 'Quiet Apartment Near Lake',
        street: '310 Kalyani Nagar, Pune, Maharashtra',
        rent: 20000,
        sqft: 850,
        leaseType: 'both',
        amenities: [
            'Car Park',
            'Laundry Service'
        ]
    }),
];