import dynamic from "next/dynamic";
import { useQuery, useLazyQuery, gql } from "@apollo/client";
import { useState } from "react";
import _ from "lodash";

const applicationsQuery = gql`
  query applications {
  applications {
    name
    businessCriticality
    machinesHostsApplication {
      name
    }
    consumesInterfaceInterfaces {
      interfaceName
    }
    providesCapabilityBusinessCapabilities {
      capabilityName
      maturity
    }
    providesInterfaceInterfaces {
      interfaceName
      interfaceType
    }
  }
}
`;


const NoSSRForceGraph = dynamic(() => import("../lib/NoSSRForceGraph"), {
  ssr: false,
});

const formatData = (data) => {
  const nodes = [];
  const links = [];

  if (!data.applications) {
    return { nodes, links };
  }

  data.applications.forEach((a) => {
    nodes.push({
      id: a.name,
      businessCriticality : a.businessCriticality,
    });

    nodes.push({
      id: a.machinesHostsApplication.name,
    });

    nodes.push({
      id: a.providesCapabilityBusinessCapabilities.name,
    });

    links.push({
      source: a.machinesHostsApplication.name,
      target: a.name,
    });

    links.push({
      source: a.providesCapabilityBusinessCapabilities.name,
      target: a.name,
    });

  });

  return {
    nodes: _.uniqBy(nodes, "id"),
    links,
  };
};

export default function Home() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const { data } = useQuery(applicationsQuery, {
    onCompleted: (data) => { 
      console.log("=the data is " + data) 
      setGraphData(formatData(data));
    },
  });
  

  return (
    <NoSSRForceGraph
    nodeLabel={"id"}
    graphData={graphData}
    onNodeClick={(node, event) => {
      console.log(node);
    }} 
    />


  );
}
