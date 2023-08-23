import * as React from 'react';
import Box from '@mui/material/Box';
import Tree from 'react-d3-tree';

const orgChart = {
  name: 'CEO',
  children: [
    {
      name: 'Manager',
      attributes: {
        department: 'Production',
      },
      children: [
        {
          name: 'Foreman',
          attributes: {
            department: 'Fabrication',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
        {
          name: 'Foreman',
          attributes: {
            department: 'Assembly',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
      ],
    },
  ],
};

const FeedII = ({isActive}) => {
    return (
        <Box flex={4} p={2} sx={{ display: "flex", justifyContent: "center" }}>
            <Tree data={orgChart} />
        </Box>  
    )
}
  

export default FeedII

