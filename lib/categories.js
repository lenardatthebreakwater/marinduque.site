export const CATEGORIES = ['All', 'Tourism', 'Food', 'Festivals', 'Living']

export const CATEGORY_KEYWORDS = {
  tourism: ['tourism', 'beach', 'travel', 'tourist', 'island', 'resort', 'trek', 'cave', 'hopping', 'itinerary', 'stay', 'visit'],
  food: ['food', 'eat', 'delicacies', 'restaurant', 'cuisine', 'longganisa', 'taboan', 'squid', 'seafood', 'market'],
  festivals: ['festival', 'moriones', 'holy week', 'celebration', 'tradition', 'event', 'fiesta'],
  living: ['living', 'retire', 'retiring', 'cost', 'life', 'local', 'province', 'community'],
}

export function postMatchesCategory(post, category) {
  if (category === 'all') return true
  const keywords = CATEGORY_KEYWORDS[category] || []
  const searchText = `${post.title} ${post.description} ${post.keywords?.join(' ')}`.toLowerCase()
  return keywords.some((kw) => searchText.includes(kw))
}
