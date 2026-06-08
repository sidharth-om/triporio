const User = require('../models/User');
const Destination = require('../models/Destination');
const TripRequest = require('../models/TripRequest');
const SeasonalEvent = require('../models/SeasonalEvent');

// @desc  Get dashboard stats (Admin)
// @route GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalDestinations, totalTrips, totalEvents, pendingTrips] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Destination.countDocuments({ isActive: true }),
      TripRequest.countDocuments(),
      SeasonalEvent.countDocuments({ isActive: true }),
      TripRequest.countDocuments({ status: 'Pending' }),
    ]);
    res.json({ success: true, stats: { totalUsers, totalDestinations, totalTrips, totalEvents, pendingTrips } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all users (Admin)
// @route GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Seed initial data (Admin)
// @route POST /api/admin/seed
exports.seedData = async (req, res) => {
  try {
    const destinations = [
      {
        name: 'Wayanad',
        shortDescription: 'Misty mountains and lush forests of North Kerala',
        description: 'Wayanad is a beautiful hill station nestled in the Western Ghats of Kerala. Known for its dense forests, exotic wildlife, ancient caves, and stunning waterfalls, it offers a perfect blend of adventure and nature.',
        category: 'Hill Station',
        location: 'Wayanad, Kerala',
        bestSeason: 'October to May',
        highlights: ['Edakkal Caves', 'Chembra Peak', 'Pookode Lake', 'Banasura Sagar Dam'],
        image: 'https://images.unsplash.com/photo-1580392917481-ce0bd75c5c08?w=800',
        featured: true,
        rating: 4.8,
      },
      {
        name: 'Bekal Fort',
        shortDescription: 'Historic fort by the Arabian Sea shoreline',
        description: 'Bekal Fort is the largest fort in Kerala, standing majestically on a headland that juts into the Arabian Sea. The fort offers breathtaking views of the sea and is surrounded by beautiful beaches.',
        category: 'Heritage',
        location: 'Kasaragod, Kerala',
        bestSeason: 'October to March',
        highlights: ['Fort Observation Towers', 'Bekal Beach', 'Pallikara Beach', 'Hosdurg Fort'],
        image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800',
        featured: true,
        rating: 4.7,
      },
      {
        name: 'Kannur',
        shortDescription: 'Land of Theyyam and pristine golden beaches',
        description: "Kannur, the land of Theyyam, is known for its vibrant culture, pristine beaches, and cashew plantations. It's where the ancient art form of Theyyam comes alive in traditional temple rituals.",
        category: 'Culture',
        location: 'Kannur, Kerala',
        bestSeason: 'November to February',
        highlights: ['Theyyam Rituals', 'Payyambalam Beach', "St. Angelo's Fort", 'Muzhappilangad Beach'],
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
        featured: true,
        rating: 4.6,
      },
      {
        name: 'Payyambalam Beach',
        shortDescription: 'Serene urban beach with golden sands',
        description: 'Payyambalam Beach in Kannur is a picturesque urban beach known for its calm waters and golden sands. The beach features a beautiful sculpture garden and is perfect for evening walks.',
        category: 'Beach',
        location: 'Kannur, Kerala',
        bestSeason: 'October to March',
        highlights: ['Sculpture Garden', 'Golden Sands', 'Sunset Views', 'Seafood Shacks'],
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        rating: 4.4,
      },
      {
        name: 'Muzhappilangad Drive-in Beach',
        shortDescription: "Asia's longest drive-in beach",
        description: "Muzhappilangad is Asia's longest drive-in beach, stretching over 4 km of motorable coastline. Visitors can drive their vehicles right onto the beach and enjoy the unique experience of driving by the sea.",
        category: 'Beach',
        location: 'Kannur, Kerala',
        bestSeason: 'October to March',
        highlights: ['Drive-in Beach', '4km Motorable Coast', 'Water Sports', 'Rocky Islands'],
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        featured: true,
        rating: 4.9,
      },
      {
        name: 'Ranipuram',
        shortDescription: 'The Ooty of Kerala with panoramic views',
        description: "Ranipuram, often called the 'Ooty of Kerala', is a hill station in Kasaragod district. Located at an altitude of 750 meters, it offers spectacular views of the surrounding valleys and forests.",
        category: 'Hill Station',
        location: 'Kasaragod, Kerala',
        bestSeason: 'October to May',
        highlights: ['Panoramic Valleys', 'Trekking Trails', 'Shola Forests', 'Sunrise Points'],
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        rating: 4.5,
      },
      {
        name: 'Aralam Wildlife Sanctuary',
        shortDescription: "Kerala's only wildlife reserve in Kannur",
        description: "Aralam Wildlife Sanctuary is Kerala's only wildlife sanctuary in Kannur district. Spread over 55 sq km, it is home to elephants, tigers, leopards, and a rich variety of birds.",
        category: 'Wildlife',
        location: 'Kannur, Kerala',
        bestSeason: 'November to April',
        highlights: ['Wildlife Safari', 'Bird Watching', 'Tribal Heritage', 'Trekking'],
        image: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800',
        rating: 4.4,
      },
      {
        name: 'Thalassery',
        shortDescription: 'Birthplace of circus in India with colonial charm',
        description: 'Thalassery is a historic coastal town known as the birthplace of the Indian circus. It has a rich colonial heritage with a famous British-era fort, and is renowned for its unique Tellicherry biryani.',
        category: 'Heritage',
        location: 'Kannur, Kerala',
        bestSeason: 'October to March',
        highlights: ['Thalassery Fort', 'Circus Academy', 'Mukheri Mosque', 'Tellicherry Biryani'],
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
        rating: 4.3,
      },
      {
        name: 'Paithalmala',
        shortDescription: 'Highest peak in Kannur with misty valleys',
        description: 'Paithalmala is the highest peak in Kannur district, standing at 1372 meters. The trek to the summit offers spectacular views of misty forests, rolling hills, and the distant Arabian Sea.',
        category: 'Adventure',
        location: 'Kannur, Kerala',
        bestSeason: 'November to February',
        highlights: ['Peak Trekking', 'Mist Valleys', 'Sunset Views', 'Shola Forests'],
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
        rating: 4.7,
      },
      {
        name: 'Vagamon',
        shortDescription: 'Meadows and mist in Kerala highlands',
        description: "Vagamon is a serene hill station known for its lush green meadows, pine forests, and misty climate. Often called a hidden gem, it's perfect for those who want to escape the crowds.",
        category: 'Nature',
        location: 'Idukki, Kerala',
        bestSeason: 'September to March',
        highlights: ['Pine Forests', 'Paragliding', 'Murugan Hills', 'Thangal Para'],
        image: 'https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?w=800',
        rating: 4.6,
      },
    ];

    const events = [
      {
        name: 'Theyyam',
        shortDescription: 'Ancient ritualistic dance form of North Kerala',
        description: "Theyyam is one of the most spectacular and ancient ritual art forms of North Kerala. Performed at local shrines and temples, it is a magical blend of dance, music, and colorful costumes where performers embody gods and ancestral spirits. The elaborate makeup and costumes take hours to prepare, creating an unforgettable visual spectacle.",
        category: 'Cultural',
        location: 'Kannur & Kasaragod, Kerala',
        season: 'Winter',
        months: ['November', 'December', 'January', 'February', 'March', 'April', 'May'],
        highlights: ['Ritualistic Dance', 'Traditional Costumes', 'Temple Festivals', 'Ancestral Worship'],
        image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800',
      },
      {
        name: 'Pooram Festival',
        shortDescription: 'Grand temple elephant processions',
        description: "Pooram is one of Kerala's grandest temple festivals featuring majestic elephant processions, traditional music, and spectacular fireworks. The festival showcases the cultural richness and devotion of the people.",
        category: 'Temple',
        location: 'Various Temples, Kerala',
        season: 'Spring',
        months: ['April', 'May'],
        highlights: ['Elephant Processions', 'Traditional Music', 'Fireworks', 'Cultural Programs'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      },
      {
        name: 'Monsoon Tourism',
        shortDescription: 'Experience Kerala in its most vibrant form',
        description: 'Kerala during the monsoon is breathtakingly beautiful. The Western Ghats turn into a lush green paradise, waterfalls are at their peak, and the air is filled with the fragrance of blooming flowers. The monsoon season brings unique Ayurvedic treatments and rejuvenation packages.',
        category: 'Monsoon',
        location: 'All of Kerala',
        season: 'Monsoon',
        months: ['June', 'July', 'August', 'September'],
        highlights: ['Ayurveda Treatments', 'Waterfalls', 'Green Forests', 'Nature Walks'],
        image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800',
      },
      {
        name: 'Kerala Food Festival',
        shortDescription: 'Authentic North Kerala culinary traditions',
        description: 'North Kerala is a food lovers paradise with unique culinary traditions. From the legendary Thalassery Biryani to fresh seafood dishes and traditional banana leaf meals, the food culture here is unlike anywhere else in India.',
        category: 'Food',
        location: 'Thalassery, Kannur, Kerala',
        season: 'Year-round',
        months: ['January', 'February', 'March', 'October', 'November', 'December'],
        highlights: ['Thalassery Biryani', 'Seafood Delicacies', 'Banana Leaf Meals', 'Toddy Tasting'],
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      },
      {
        name: 'Onam Festival',
        shortDescription: 'Kerala\'s harvest festival of abundance',
        description: "Onam is Kerala's most celebrated festival, marking the legendary return of King Mahabali. Celebrated with elaborate Pookalam (flower carpets), Vallam Kali (boat races), Pulikali (tiger dances), and grand Sadhya feasts, Onam captures the essence of Kerala's cultural identity.",
        category: 'Festival',
        location: 'All of Kerala',
        season: 'Monsoon End',
        months: ['August', 'September'],
        highlights: ['Flower Carpets', 'Boat Races', 'Sadhya Feast', 'Traditional Games'],
        image: 'https://images.unsplash.com/photo-1574247714543-4d2e89cbbb78?w=800',
      },
    ];

    await Destination.deleteMany({});
    await SeasonalEvent.deleteMany({});
    await Destination.insertMany(destinations);
    await SeasonalEvent.insertMany(events);

    res.json({ success: true, message: 'Data seeded successfully', destinations: destinations.length, events: events.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
