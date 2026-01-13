
import { Trade, Question } from './types';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    trade: Trade.B1_ENGINEER,
    text: 'What is the primary purpose of an Aircraft Maintenance Manual (AMM)?',
    options: [
      { id: 'A', text: 'To list spare parts only' },
      { id: 'B', text: 'To guide aircraft inspection and maintenance procedures' },
      { id: 'C', text: 'To train pilots' },
      { id: 'D', text: 'To certify aircraft manufacturers' }
    ],
    correctAnswer: 'B',
    explanation: 'The AMM provides approved procedures for inspection, repair, servicing, and maintenance of aircraft systems.',
    difficulty: 'Easy'
  },
  {
    id: 'q2',
    trade: Trade.B2_ENGINEER,
    text: 'Which system is primarily maintained by a B2 engineer?',
    options: [
      { id: 'A', text: 'Landing gear hydraulics' },
      { id: 'B', text: 'Avionics and electrical systems' },
      { id: 'C', text: 'Fuel tanks' },
      { id: 'D', text: 'Aircraft structure' }
    ],
    correctAnswer: 'B',
    explanation: 'B2 engineers specialize in the electrical, navigational, and electronic systems of an aircraft.',
    difficulty: 'Easy'
  },
  {
    id: 'q3',
    trade: Trade.HELICOPTER_PILOT,
    text: 'What happens when collective pitch is increased?',
    options: [
      { id: 'A', text: 'Rotor RPM decreases' },
      { id: 'B', text: 'Lift increases' },
      { id: 'C', text: 'Tail rotor stops' },
      { id: 'D', text: 'Forward speed decreases automatically' }
    ],
    correctAnswer: 'B',
    explanation: 'Increasing collective pitch increases the angle of attack for all main rotor blades simultaneously, thus increasing lift.',
    difficulty: 'Medium'
  },
  {
    id: 'q4',
    trade: Trade.FLIGHT_DISPATCHER,
    text: 'Who has joint responsibility for flight safety?',
    options: [
      { id: 'A', text: 'Only the pilot' },
      { id: 'B', text: 'Only the dispatcher' },
      { id: 'C', text: 'Pilot and dispatcher' },
      { id: 'D', text: 'Air traffic control' }
    ],
    correctAnswer: 'C',
    explanation: 'Regulatory standards mandate that both the Pilot-in-Command and the Aircraft Dispatcher share joint responsibility for the safety of the flight.',
    difficulty: 'Easy'
  },
  {
    id: 'q5',
    trade: Trade.CABIN_CREW,
    text: 'What is the primary responsibility during an evacuation?',
    options: [
      { id: 'A', text: 'Protect luggage' },
      { id: 'B', text: 'Assist passengers to evacuate safely' },
      { id: 'C', text: 'Close cockpit door' },
      { id: 'D', text: 'Record passenger names' }
    ],
    correctAnswer: 'B',
    explanation: 'The paramount duty of cabin crew during an emergency is ensuring the fastest and safest evacuation of all souls on board.',
    difficulty: 'Easy'
  },
  {
    id: 'q6',
    trade: Trade.ATC,
    text: 'What is the primary purpose of ATC separation?',
    options: [
      { id: 'A', text: 'Reduce noise' },
      { id: 'B', text: 'Prevent collision' },
      { id: 'C', text: 'Increase speed' },
      { id: 'D', text: 'Save fuel' }
    ],
    correctAnswer: 'B',
    explanation: 'ATC separation is maintained primarily to prevent mid-air collisions and ensure an orderly flow of traffic.',
    difficulty: 'Easy'
  }
];

export const TRADE_INFO = [
  { trade: Trade.B1_ENGINEER, icon: '🔧', color: 'bg-blue-600' },
  { trade: Trade.B2_ENGINEER, icon: '⚡', color: 'bg-indigo-600' },
  { trade: Trade.HELICOPTER_PILOT, icon: '🚁', color: 'bg-teal-600' },
  { trade: Trade.FIXED_WING_PILOT, icon: '✈️', color: 'bg-sky-600' },
  { trade: Trade.FLIGHT_DISPATCHER, icon: '📋', color: 'bg-orange-600' },
  { trade: Trade.CABIN_CREW, icon: '👨‍✈️', color: 'bg-pink-600' },
  { trade: Trade.ATC, icon: '📡', color: 'bg-purple-600' },
  { trade: Trade.AVIONICS, icon: '📟', color: 'bg-cyan-600' },
  { trade: Trade.GROUND_OPS, icon: '🚛', color: 'bg-amber-600' },
  { trade: Trade.SAFETY_HUMAN_FACTORS, icon: '🧠', color: 'bg-rose-600' },
];
