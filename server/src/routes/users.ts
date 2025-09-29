import express from 'express';
import User, { IUser } from '../models/User';
import { checkJwt, AuthenticatedRequest, extractUserId } from '../middleware/auth';

const router = express.Router();

// Get current user profile
router.get('/me', checkJwt, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    let user = await User.findOne({ auth0Id: userId });

    if (!user) {
      // Create user from Auth0 token if doesn't exist
      const { name, email, picture } = req.auth || {};
      user = new User({
        auth0Id: userId,
        email: email || '',
        name: name || '',
        avatar: picture || '',
        status: 'current-employee',
        experience: 'pm',
        pmFocus: [],
        industry: [],
        companyStage: [],
        skills: [],
        interests: [],
        privacy: {
          showLocation: true,
          showExperience: true,
          showCompany: true,
          allowConnections: true,
          anonymousMode: false,
        },
        isProfileComplete: false,
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/me', checkJwt, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    const allowedFields = [
      'status', 'experience', 'pmFocus', 'industry', 'companyStage',
      'skills', 'interests', 'location', 'privacy'
    ];

    const updateData: Partial<IUser> = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        (updateData as any)[field] = req.body[field];
      }
    });

    // Check if profile is complete
    const requiredFields = ['status', 'experience', 'pmFocus', 'industry'];
    const isComplete = requiredFields.every(field =>
      req.body[field] && (Array.isArray(req.body[field]) ? req.body[field].length > 0 : true)
    );

    if (isComplete) {
      updateData.isProfileComplete = true;
    }

    const user = await User.findOneAndUpdate(
      { auth0Id: userId },
      { ...updateData, lastActive: new Date() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get users for map (with privacy filters)
router.get('/map', checkJwt, async (req: AuthenticatedRequest, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;

    const query: any = {
      'privacy.showLocation': true,
      'location.isVisible': true,
      'location.coordinates': { $exists: true },
    };

    // If coordinates provided, search within radius
    if (lat && lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)]
          },
          $maxDistance: parseInt(radius as string) * 1000 // Convert km to meters
        }
      };
    }

    const users = await User.find(query)
      .select('name avatar status experience pmFocus location.city location.coordinates')
      .limit(100);

    res.json(users);
  } catch (error) {
    console.error('Error fetching map users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search users
router.get('/search', checkJwt, async (req: AuthenticatedRequest, res) => {
  try {
    const { q, status, experience, pmFocus, industry, city, limit = 20 } = req.query;

    const query: any = {
      'privacy.anonymousMode': false,
    };

    if (q) {
      query.$text = { $search: q as string };
    }

    if (status) {
      query.status = status;
    }

    if (experience) {
      query.experience = experience;
    }

    if (pmFocus) {
      query.pmFocus = { $in: Array.isArray(pmFocus) ? pmFocus : [pmFocus] };
    }

    if (industry) {
      query.industry = { $in: Array.isArray(industry) ? industry : [industry] };
    }

    if (city) {
      query['location.city'] = new RegExp(city as string, 'i');
    }

    const users = await User.find(query)
      .select('name avatar status experience pmFocus industry location.city')
      .limit(parseInt(limit as string));

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', checkJwt, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-auth0Id -email -privacy');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check privacy settings
    if (user.privacy.anonymousMode) {
      return res.status(403).json({ error: 'User profile is private' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;