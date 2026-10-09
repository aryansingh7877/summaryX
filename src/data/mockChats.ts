import { RawChatMessage } from '@/types';

export const INITIAL_RAW_CHATS: RawChatMessage[] = [
  // --- INCIDENT 1: Production Database Connection Exhaustion (URGENT) ---
  {
    id: 'msg-01',
    sender: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    role: 'Lead SRE',
    channel: '#incident-sev1',
    content: '🚨 ALERT: Production Postgres connection pool at 98% saturation in us-east-1! API latency spiking to 3400ms.',
    timestamp: '11:42 AM',
    rawTime: Date.now() - 3600000 * 2.5,
    sentiment: 'urgent'
  },
  {
    id: 'msg-02',
    sender: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Staff SecOps',
    channel: '#incident-sev1',
    content: 'Looking at PgBouncer stats right now. We have 450 orphaned connections from the batch crawler service.',
    timestamp: '11:43 AM',
    rawTime: Date.now() - 3600000 * 2.4,
    sentiment: 'urgent'
  },
  {
    id: 'msg-03',
    sender: 'Marcus Brody',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'Backend Eng',
    channel: '#incident-sev1',
    content: 'ok',
    timestamp: '11:43 AM',
    rawTime: Date.now() - 3600000 * 2.4,
    sentiment: 'neutral'
  },
  {
    id: 'msg-04',
    sender: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    role: 'Lead SRE',
    channel: '#incident-sev1',
    content: '@marcus Terminate the crawler pod immediately or the entire checkout gateway drops before 12:15 PM EOD release!',
    timestamp: '11:44 AM',
    rawTime: Date.now() - 3600000 * 2.3,
    sentiment: 'urgent'
  },
  {
    id: 'msg-05',
    sender: 'Marcus Brody',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'Backend Eng',
    channel: '#incident-sev1',
    content: '👍 will do right now',
    timestamp: '11:45 AM',
    rawTime: Date.now() - 3600000 * 2.2,
    sentiment: 'neutral'
  },
  {
    id: 'msg-06',
    sender: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    role: 'Lead SRE',
    channel: '#incident-sev1',
    content: 'Killed the crawler. Connections dropped to 28%. We need @sarah to patch connection pooling timeout by 1:00 PM.',
    timestamp: '11:48 AM',
    rawTime: Date.now() - 3600000 * 2.1,
    sentiment: 'urgent'
  },

  // --- TOPIC 2: Auth Provider Migration Debate (DEBATE) ---
  {
    id: 'msg-07',
    sender: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    role: 'Lead Architect',
    channel: '#arch-rfc',
    content: 'We need to decide our customer auth stack for Q4: Supabase Auth vs Clerk vs self-hosted Ory Kratos. Our Auth0 bill hit $14,000/mo.',
    timestamp: '10:02 AM',
    rawTime: Date.now() - 3600000 * 3.8,
    sentiment: 'conflict'
  },
  {
    id: 'msg-08',
    sender: 'Liam Vance',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    role: 'Frontend Lead',
    channel: '#arch-rfc',
    content: 'Clerk provides the best Next.js App Router hooks and prebuilt UI, but their enterprise SAML SSO tier pricing jumps 10x once we cross 10k MAU.',
    timestamp: '10:08 AM',
    rawTime: Date.now() - 3600000 * 3.7,
    sentiment: 'conflict'
  },
  {
    id: 'msg-09',
    sender: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    role: 'Principal Designer',
    channel: '#arch-rfc',
    content: 'cool',
    timestamp: '10:09 AM',
    rawTime: Date.now() - 3600000 * 3.65,
    sentiment: 'neutral'
  },
  {
    id: 'msg-10',
    sender: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Staff SecOps',
    channel: '#arch-rfc',
    content: 'Strongly vote against self-hosting Ory. Our team has zero bandwidth to maintain FIDO2 WebAuthn compliance and SOC2 pen-test audits ourselves.',
    timestamp: '10:15 AM',
    rawTime: Date.now() - 3600000 * 3.5,
    sentiment: 'conflict'
  },
  {
    id: 'msg-11',
    sender: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    role: 'Lead Architect',
    channel: '#arch-rfc',
    content: 'Agreed on Ory risk. So the tradeoff is Clerk (faster DX) vs Supabase Auth (cheaper + row level security on Postgres). Let us run a 2-day spike.',
    timestamp: '10:20 AM',
    rawTime: Date.now() - 3600000 * 3.4,
    sentiment: 'conflict'
  },

  // --- TOPIC 3: Design System v2.0 Sign-off (RESOLVED) ---
  {
    id: 'msg-12',
    sender: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    role: 'Principal Designer',
    channel: '#design-crit',
    content: 'Figma tokens for Carbon Dark 2.0 and glassmorphic micro-components are finalized and reviewed by accessibility team.',
    timestamp: '09:15 AM',
    rawTime: Date.now() - 3600000 * 4.5,
    sentiment: 'positive'
  },
  {
    id: 'msg-13',
    sender: 'Noah Kim',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    role: 'Product Lead',
    channel: '#design-crit',
    content: '🎉 Looks stunning. Contrast ratios passed AAA level on the cyber neon palette.',
    timestamp: '09:20 AM',
    rawTime: Date.now() - 3600000 * 4.4,
    sentiment: 'positive'
  },
  {
    id: 'msg-14',
    sender: 'Liam Vance',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    role: 'Frontend Lead',
    channel: '#design-crit',
    content: 'Approved. Tailwind config is updated with glass-border and neon drop-shadows. Merged PR #409 into main branch.',
    timestamp: '09:35 AM',
    rawTime: Date.now() - 3600000 * 4.2,
    sentiment: 'positive'
  },

  // --- TOPIC 4: Security Token Expiration Zero-Day (URGENT) ---
  {
    id: 'msg-15',
    sender: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Staff SecOps',
    channel: '#security-ops',
    content: 'CRITICAL: JWT refresh tokens issued between 02:00 UTC and 06:00 UTC lack the aud claim verification due to the v3.4 middleware release.',
    timestamp: '11:10 AM',
    rawTime: Date.now() - 3600000 * 2.8,
    sentiment: 'urgent'
  },
  {
    id: 'msg-16',
    sender: 'Jordan Blake',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    role: 'VP Engineering',
    channel: '#security-ops',
    content: 'Has there been any external exploitation detected in Datadog audit logs?',
    timestamp: '11:12 AM',
    rawTime: Date.now() - 3600000 * 2.75,
    sentiment: 'urgent'
  },
  {
    id: 'msg-17',
    sender: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Staff SecOps',
    channel: '#security-ops',
    content: 'No external leaks detected. But we MUST invalidate all 1,280 active session tokens and force refresh before 2:00 PM EST today.',
    timestamp: '11:15 AM',
    rawTime: Date.now() - 3600000 * 2.7,
    sentiment: 'urgent'
  },
  {
    id: 'msg-18',
    sender: 'Jordan Blake',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    role: 'VP Engineering',
    channel: '#security-ops',
    content: 'Do it now. @elena assist Sarah with Redis token flush.',
    timestamp: '11:16 AM',
    rawTime: Date.now() - 3600000 * 2.65,
    sentiment: 'urgent'
  },

  // --- TOPIC 5: Mobile WebGL vs Canvas2D Rendering Engine (DEBATE) ---
  {
    id: 'msg-19',
    sender: 'Liam Vance',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    role: 'Frontend Lead',
    channel: '#mobile-core',
    content: 'Low-tier Android devices (e.g. Mali-G52 GPU) drop to 24fps when rendering 150 Three.js node meshes with bloom shaders enabled.',
    timestamp: '10:30 AM',
    rawTime: Date.now() - 3600000 * 3.2,
    sentiment: 'conflict'
  },
  {
    id: 'msg-20',
    sender: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    role: 'Lead Architect',
    channel: '#mobile-core',
    content: 'Should we introduce an adaptive Level-of-Detail (LOD) instanced mesh system, or completely fallback to 2D HTML Canvas on low battery?',
    timestamp: '10:35 AM',
    rawTime: Date.now() - 3600000 * 3.1,
    sentiment: 'conflict'
  },
  {
    id: 'msg-21',
    sender: 'Liam Vance',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    role: 'Frontend Lead',
    channel: '#mobile-core',
    content: 'InstancedMesh + disabling post-processing bloom on battery saver mode keeps 60fps locked even on $150 devices. Testing benchmark branch now.',
    timestamp: '10:42 AM',
    rawTime: Date.now() - 3600000 * 3.0,
    sentiment: 'conflict'
  },

  // --- TOPIC 6: Q4 Infrastructure Budget & AWS Savings Plan (RESOLVED) ---
  {
    id: 'msg-22',
    sender: 'Jordan Blake',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    role: 'VP Engineering',
    channel: '#finance-tech',
    content: 'Finance signed off on the 3-year Compute Savings Plan. Total infrastructure spend capped at $32,000/mo, generating $8,400 monthly savings.',
    timestamp: '08:45 AM',
    rawTime: Date.now() - 3600000 * 5.0,
    sentiment: 'positive'
  },
  {
    id: 'msg-23',
    sender: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    role: 'Lead SRE',
    channel: '#finance-tech',
    content: 'Awesome news. That frees up budget for our dedicated vector embeddings cluster.',
    timestamp: '08:50 AM',
    rawTime: Date.now() - 3600000 * 4.9,
    sentiment: 'positive'
  },

  // --- NOISE MESSAGES (Will be discarded by Tier 1 Zero-Cost engine) ---
  { id: 'msg-n1', sender: 'Marcus Brody', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', role: 'Backend Eng', channel: '#general', content: 'gm everyone ☕', timestamp: '08:30 AM', rawTime: Date.now() - 3600000 * 5.3 },
  { id: 'msg-n2', sender: 'Noah Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80', role: 'Product Lead', channel: '#general', content: 'morning!', timestamp: '08:32 AM', rawTime: Date.now() - 3600000 * 5.25 },
  { id: 'msg-n3', sender: 'Maya Lin', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80', role: 'Principal Designer', channel: '#general', content: 'hey', timestamp: '08:33 AM', rawTime: Date.now() - 3600000 * 5.2 },
  { id: 'msg-n4', sender: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', role: 'Lead SRE', channel: '#random', content: 'lol that meme', timestamp: '09:02 AM', rawTime: Date.now() - 3600000 * 4.8 },
  { id: 'msg-n5', sender: 'Liam Vance', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80', role: 'Frontend Lead', channel: '#random', content: '😂😂😂', timestamp: '09:05 AM', rawTime: Date.now() - 3600000 * 4.7 },
  { id: 'msg-n6', sender: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', role: 'Staff SecOps', channel: '#incident-sev1', content: 'k', timestamp: '11:46 AM', rawTime: Date.now() - 3600000 * 2.15 },
  { id: 'msg-n7', sender: 'Marcus Brody', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', role: 'Backend Eng', channel: '#incident-sev1', content: 'thanks', timestamp: '11:50 AM', rawTime: Date.now() - 3600000 * 2.0 },
  { id: 'msg-n8', sender: 'Noah Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80', role: 'Product Lead', channel: '#design-crit', content: '👍', timestamp: '09:36 AM', rawTime: Date.now() - 3600000 * 4.18 },
  { id: 'msg-n9', sender: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', role: 'Lead Architect', channel: '#arch-rfc', content: 'sounds good', timestamp: '10:22 AM', rawTime: Date.now() - 3600000 * 3.35 },
  { id: 'msg-n10', sender: 'Jordan Blake', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80', role: 'VP Engineering', channel: '#finance-tech', content: 'see ya at standup', timestamp: '08:52 AM', rawTime: Date.now() - 3600000 * 4.88 }
];
