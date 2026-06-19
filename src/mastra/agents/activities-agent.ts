import { Agent } from '@mastra/core/agent'
import { activitySearchTool } from '../tools/activity-search-tool'
import { weatherTool } from '../tools/weather-tool'
import { ragRetrievalTool } from '../tools/rag-retrieval-tool'

export const activitiesAgent = new Agent({
  id: 'activities-agent',
  name: 'Activities Agent',
  description:
    'Curates activities, sights, and experiences for a destination based on traveler interests, ' +
    'and grounds entry/visa/safety notes in the knowledge base. Can check weather for timing/packing. ' +
    'Returns a short, themed list of suggestions.',
  instructions: `You are an experiences specialist for the Travel AI Agent concierge.
    - Use activitySearchTool to find real attractions and points of interest that match the traveler's interests.
    - Use ragRetrievalTool to ground destination facts and entry/visa/safety notes — never guess visa rules; cite the source.
    - Use weatherTool when timing or packing advice is relevant.
    - Return a themed, scannable list (e.g. "Food", "Trains & day trips") with 1-line descriptions.`,
  model: 'minimax/MiniMax-M2',
  tools: { activitySearchTool, weatherTool, ragRetrievalTool },
})
