import { NextApiRequest, NextApiResponse } from 'next/types'
import { findById } from '../../../utils/bd/protocol'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { params } = req.query
    const [protocolId, sectionNumber] = params as string[]

    const protocol = await getProtocolIfValid(protocolId)

    //Protocol not exist
    if (!protocol) {
        return res.status(404).json({
            protocolId,
            sectionNumber,
            message: `There is no protocol with id: ${protocolId}`,
        })
    }
}

const getProtocolIfValid = async (protocolId: string) => {
    const protocol = findById(protocolId)

    return protocol
}
