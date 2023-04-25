'use client'
//I couldn't implement this as a server side component, sadly.
import { Button } from '@elements/button';
import React from 'react'
import { CSVLink, CSVDownload } from "react-csv";


export default function ProtocolCsv({csvData, title}:{csvData: any, title:string}) {



  return (
    <Button><CSVLink data={csvData}>{title}</CSVLink></Button>
  )
}
