import { Request, Response } from 'express';
import ForumTopic from '../models/ForumTopics';
import ForumComment from '../models/ForumComments';
import { User } from '../models/userprofile';

// Add custom type for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

export const getAllTopics = async (req: Request, res: Response) => {
  try {
    const topics = await ForumTopic.findAll({
      include: [
        { model: User, attributes: ['username', 'profilePicture'] },
        { model: ForumComment,  attributes: ['id'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Error fetching topics' });
  }
};

export const getTopicById = async (req: Request, res: Response) => {
  try {
    const topic = await ForumTopic.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['username', 'profilePicture'] },
        {
          model: ForumComment,
          include: [{ model: User, attributes: ['username', 'profilePicture'] }]
        }
      ]
    });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ message: 'Error fetching topic' });
  }
};

export const createTopic = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { title, content, category } = req.body;
    const topic = await ForumTopic.create({
      title,
      content,
      category,
      userId: req.user.id
    });
    res.status(201).json(topic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ message: 'Error creating topic' });
  }
};

export const updateTopic = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { title, content, category } = req.body;
    const topic = await ForumTopic.findByPk(req.params.id);
   
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
   
    if (topic.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
   
    await topic.update({ title, content, category });
    res.json(topic);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ message: 'Error updating topic' });
  }
};

export const deleteTopic = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const topic = await ForumTopic.findByPk(req.params.id);
   
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
   
    if (topic.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
   
    await topic.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ message: 'Error deleting topic' });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    const comments = await ForumComment.findAll({
      where: { topicId },
      include: [{ model: User, attributes: ['username', 'profilePicture'] }],
      order: [['createdAt', 'ASC']]
    });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

export const createComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { content } = req.body;
    const { topicId } = req.params;
   
    const topic = await ForumTopic.findByPk(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
   
    const comment = await ForumComment.create({
      content,
      topicId: parseInt(topicId),
      userId: req.user.id
    });
   
    const commentWithUser = await ForumComment.findByPk(comment.id, {
      include: [{ model: User, attributes: ['username', 'profilePicture'] }]
    });
   
    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment' });
  }
};