"use-client"
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function DisplayPlan() {

    const [myLearninPlan, setMyLearningPlan] = useState<Schema["LearningPlan"][]>([]);

    async function getMyLearningPlan() {
        const {data} = await client.models.LearningPlan.list();
        setMyLearningPlan(data);
    }

    useEffect(() => {
        getMyLearningPlan();
      }, []);

      return (
        <div>
          <h1>Learning Plan</h1>
          <ul>
            {myLearninPlan.map((learningPlan) => (
              <li key={learningPlan.id}>{learningPlan.details}</li>
            ))}
          </ul>
        </div>
      ); 

}