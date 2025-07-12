import React from 'react'
import Navbar from './Navbar'
import UserCard from './UserCard'

export function Homepage() {
    

    return (
        <>

        <div>
            <Navbar/>
            <h1 className="text-4xl font-bold text-center mt-10">Welcome to Skill Swap Platform</h1>
            <UserCard user={{
                name: "John Doe",
                skillsOffered: ["JavaScript", "React", "Node.js"],
                skillsWanted: ["Python", "Machine Learning"],
                rating: 4.5
            }} />
        </div>
            
        </>
    )
}
