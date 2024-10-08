// import { NextApiRequest, NextApiResponse } from 'next';
// import { createPetitionOnSolana } from '@/lib/solana/petitionContract';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { title, target } = req.body;

//     try {
//       const petitionAccount = await createPetitionOnSolana(title, target);
//       res.status(200).json({ petitionAccount });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to create petition' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }