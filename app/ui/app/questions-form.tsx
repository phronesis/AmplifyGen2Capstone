"use client"
import { Card, CardHeader, CardBody, FormControl, FormLabel, Tooltip, Button, Select, Radio, RadioGroup, Stack, Textarea } from '@chakra-ui/react'
import {InfoOutlineIcon} from '@chakra-ui/icons'
import {data} from '@/app/lib/data';
import { useState } from 'react';
import { BedrockRuntimeClient, InvokeModelCommand, AccessDeniedException } from '@aws-sdk/client-bedrock-runtime';

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';
import llm  from '@/amplify/custom/llm';


const client = generateClient<Schema> ()



function QuestionsForm() {
    const [selected, setSelected] = useState<string>('')
    const [roleSelected, setRoleSelected] = useState<string>('')
    const [generatedPlan, setGeneratedPlan] = useState<string>('')
    const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false)
    const [ambiguity, setAmbiguity] = useState<string>('')
    const [scopeAndInfluence, setScopeAndInfluence] = useState<string>('')
    const [execution, setExecution] = useState<string>('')
    const [communication, setCommunication] = useState<string>('')
    const [impact, setImpact] = useState<string>('')
    const [technical, setTechnical] = useState<string>('')
    const [processImprovement, setProcessImprovement] = useState<string>('')

    const options = [
        {label: 'Solutions Architect', value: 'sa'},
        // {label: 'Technical Account Manager', value: 'tam'}
      ];

    const levels = [
        {label: 'L4', value: 'l4'},
        {label: 'L5', value: 'l5'},
        {label: 'L6', value: 'l6'},
        {label: 'L7', value: 'l7'},
    ] 

    type ObjectKey = keyof typeof data;

    const myVar = selected as ObjectKey;



    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value)
        setSelected(e.target.value);

    }
    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        setRoleSelected(e.target.value);

    }

    async function getAuthenticatedUserId() {
        try {
          const { userId } = await getCurrentUser();
          console.log(userId)
          return userId

        } catch (err) {
          console.log(err);
        }
      }

    const saveLearningPlan = async () =>{
        //get the learning plan
        //save to the database
        const { errors, data: learningPlan } = await client.models.LearningPlan.create({
            details: generatedPlan,
            owner: await getAuthenticatedUserId(),
        })

    }

    const submitQuestionForm = async () => {
        //take the datamodel from the form and put it in a format that can be used by LLM
        //before we do that, let's just pass a sample message to LLM and get a response
        //connect to Amazon bedrock
    setIsLoadingForm(true);
    setGeneratedPlan('');
    const expectations = JSON.stringify(data[myVar]);
    console.log(expectations)


        const prompt = `generate a learning plan for an Amazon ${selected} Solutions Architect with the following self-rating across these functional dimensions:
        Ambiguity: ${ambiguity}, Scoope and Influence: ${scopeAndInfluence}, Execution: ${execution}, Communication: ${communication}, Impact: ${impact}, Technical: ${technical}, Process Improvement: ${processImprovement}.
        This learning plan should have objectives, and the resources to be used to improve.

        Context: required level expections for ${selected} is ${expectations}
        `

          try {
           
            const response = await llm(prompt)
            /** @type {ResponseBody} */
            //const responseBody = JSON.parse(decodedResponseBody);
            setGeneratedPlan(response);
            setIsLoadingForm(false);
        
            return response;
          } catch (err) {
            if (err instanceof AccessDeniedException) {
              console.error(
                `Access denied. Ensure you have the correct permissions to invoke model.`,
              );
            } else {
              console.error(err)
              throw err;
            }
          }

    }
    
   
  return (
    <div>
        <Card>
        <CardHeader>
            <h1>To generate your Learning Plan, answer the following questions</h1>
        </CardHeader> 
        <CardBody>
            <form>
                <div className="my-4">
                    <FormControl >
                        <FormLabel>Select Your Role</FormLabel>
                        <Select placeholder='Select option' onChange={handleRoleChange}>
                            {options.map(option => (
                                <option key={option.value} value={option.value}> {option.label}</option>
                            ))} 
                        </Select>
                    
                    </FormControl>
                </div>
                <div className='my-4' hidden={!roleSelected}>
                    <FormControl>
                        <FormLabel>Current level?</FormLabel>
                        <Select name="level" placeholder='Select option' onChange={handleChange}>
                            {levels.map(option => (
                                <option key={option.value} value={option.value}> {option.label}</option>
                            ))} 
                        </Select>
                    </FormControl>
                </div>
                <div hidden={!selected}>
                <h2>Rate yourself across the following Dimensions</h2>                
                <div className='my-4'>
                    <FormControl>
                        <FormLabel>Ambiguity <Tooltip label={data[myVar]?.ambiguity.description} placement="right">
                            <InfoOutlineIcon/>
                            </Tooltip></FormLabel>
                        <RadioGroup onChange={setAmbiguity} value={ambiguity}>
                            <Stack direction='row'>
                                <Radio value='20%'>1</Radio>
                                <Radio value='40%'>2</Radio>
                                <Radio value='60%'>3</Radio>
                                <Radio value='80%'>4</Radio>
                                <Radio value='100%'>5</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className='my-4'>
                    <FormControl>
                        <FormLabel>Scope and Influence <Tooltip label={data[myVar]?.scopeAndInfluence?.description} placement="right">
                            <InfoOutlineIcon/>
                            </Tooltip></FormLabel>
                            <RadioGroup onChange={setScopeAndInfluence} value={scopeAndInfluence}>
                                <Stack direction='row'>
                                    <Radio value='20%'>1</Radio>
                                    <Radio value='40%'>2</Radio>
                                    <Radio value='60%'>3</Radio>
                                    <Radio value='80%'>4</Radio>
                                    <Radio value='100%'>5</Radio>
                                </Stack>
                            </RadioGroup>
                    </FormControl>
                </div>
                <div className='my-4'>
                    <FormControl>
                        <FormLabel>Execution <Tooltip label={data[myVar]?.execution?.description} placement="right">
                            <InfoOutlineIcon/>
                            </Tooltip></FormLabel>
                        <RadioGroup onChange={setExecution} value={execution}>
                            <Stack direction='row'>
                                <Radio value='20%'>1</Radio>
                                <Radio value='40%'>2</Radio>
                                <Radio value='60%'>3</Radio>
                                <Radio value='80%'>4</Radio>
                                <Radio value='100%'>5</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className='my-4'>
                    <FormControl>
                        <FormLabel>Communication <Tooltip label={data[myVar]?.communication?.description} placement="right">
                            <InfoOutlineIcon/>
                            </Tooltip></FormLabel>
                        <RadioGroup onChange={setCommunication} value={communication}>
                            <Stack direction='row'>
                                <Radio value='20%'>1</Radio>
                                <Radio value='40%'>2</Radio>
                                <Radio value='60%'>3</Radio>
                                <Radio value='80%'>4</Radio>
                                <Radio value='100%'>5</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className='my-4'>
                    <FormControl>
                        <FormLabel>Impact <Tooltip label={data[myVar]?.impact?.description} placement="right">
                            <InfoOutlineIcon/>
                            </Tooltip></FormLabel>
                        <RadioGroup onChange={setImpact} value={impact}>
                            <Stack direction='row'>
                                <Radio value='20%'>1</Radio>
                                <Radio value='40%'>2</Radio>
                                <Radio value='60%'>3</Radio>
                                <Radio value='80%'>4</Radio>
                                <Radio value='100%'>5</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className='my-4'>
                    <FormControl>
                        <FormLabel>Technical <Tooltip label={data[myVar]?.technical?.description} placement="right">
                            <InfoOutlineIcon/>
                            </Tooltip></FormLabel>
                        <RadioGroup onChange={setTechnical} value={technical}>
                            <Stack direction='row'>
                                <Radio value='20%'>1</Radio>
                                <Radio value='40%'>2</Radio>
                                <Radio value='60%'>3</Radio>
                                <Radio value='80%'>4</Radio>
                                <Radio value='100%'>5</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className='my-4'>
                    <FormControl>
                        <FormLabel>Process Improvement <Tooltip label={data[myVar]?.processImprovement?.description} placement="right">
                            <InfoOutlineIcon/>
                            </Tooltip></FormLabel>
                        <RadioGroup onChange={setProcessImprovement} value={processImprovement}>
                            <Stack direction='row'>
                                <Radio value='20%'>1</Radio>
                                <Radio value='40%'>2</Radio>
                                <Radio value='60%'>3</Radio>
                                <Radio value='80%'>4</Radio>
                                <Radio value='100%'>5</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </div>
                </div>

                <Button isLoading={isLoadingForm} loadingText='Generating Plan' colorScheme='blue' hidden={!selected} onClick={submitQuestionForm}>Submit</Button>
                
            </form>

            </CardBody>
        </Card>

        <Card hidden={!generatedPlan} className='my-4'>
            <CardHeader>
                <h1>Your Learning Plan</h1>
            </CardHeader>
            <CardBody>
                <form>
                    <div className="my-4">
                        <FormControl >
                          
                            <Textarea placeholder='Your Learning Plan' defaultValue={generatedPlan} size='lg'/>

                        </FormControl>
                    </div>
                    <div>
                        <Button  colorScheme='blue' onClick={saveLearningPlan}>Submit</Button>
                    </div>

                </form>
            </CardBody>
        </Card>
    </div>
  )

}

export default QuestionsForm;
