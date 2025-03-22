import { Response } from 'express';
import { AuthRequest } from '../types/express';
import ForumTopic from '../models/ForumTopics';
import ForumComment from '../models/ForumComments';
import { User } from '../models';

export const getTopics = async (req: AuthRequest, res: Response) => {
  try {
    const topics = await ForumTopic.findAll({
      include: [
        {
          model: ForumComment,
          as: 'Comments',
          include: ['User']
        }
      ]
    });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching topics' });
  }
};

export const getTopicById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const topic = await ForumTopic.findByPk(id, {
      include: [
        {
          model: ForumComment,
          as: 'Comments',
          include: ['User']
        }
      ]
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching topic' });
  }
};

export const createTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const topic = await ForumTopic.create({
      title,
      content,
      category,
      userId
    });

    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Error creating topic' });
  }
};

export const updateTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const userId = req.user?.id;

    const topic = await ForumTopic.findByPk(id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this topic' });
    }

    await topic.update({ title, content, category });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Error updating topic' });
  }
};

export const deleteTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const topic = await ForumTopic.findByPk(id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this topic' });
    }

    await topic.destroy();
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting topic' });
  }
};

export const getComments = async (req: AuthRequest, res: Response) => {
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

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { topicId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const comment = await ForumComment.create({
      content,
      topicId: parseInt(topicId),
      userId
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment' });
  }
};