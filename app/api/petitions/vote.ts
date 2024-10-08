// import { NextApiRequest, NextApiResponse } from 'next';
// import { voteOnPetitionOnSolana } from '@/lib/solana/petitionContract';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { petitionId } = req.body;

//     try {
//       await voteOnPetitionOnSolana(petitionId);
//       res.status(200).json({ message: 'Vote recorded' });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to record vote' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }