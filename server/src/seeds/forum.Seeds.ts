export const forumSeeds = {
    topics: [
      {
        title: "Getting Started with React",
        content: "What resources would you recommend for learning React?",
        userId: 1,
        category: "Frontend Development",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Career Transition Tips",
        content: "Looking for advice on switching to tech from another field",
        userId: 2,
        category: "Career Advice",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    comments: [
      {
        content: "The official React docs are a great starting point!",
        userId: 2,
        topicId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: "I recommend starting with small projects to build confidence",
        userId: 1,
        topicId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  };
  
  