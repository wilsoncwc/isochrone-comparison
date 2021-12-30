// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ISO_APIS, modeSupported } from '../../src/constants'
import { IsoParams } from '../../src/types'

interface IsochroneRequest extends NextApiRequest {
  query: {
    payload: string;
    api: string;
  }
}

export default async function handler(
  req: IsochroneRequest,
  res: NextApiResponse
) {
  const {
    payload,
    api
  } = req.query
  try {
    const params: IsoParams = JSON.parse(payload)
    if (!ISO_APIS[api]) {
      return res.status(400).send({ error: 'Unknown service' })
    }
    if (!modeSupported(api, params.profile)) {
      return res.status(400).send({ error: 'Unsupported travel mode for this service' })
    }
    const response = await ISO_APIS[api].handler(params)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).send({ error: 'Failed to retrieve isochrone' })
  }
}
