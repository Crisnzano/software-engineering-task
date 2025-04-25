"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const groups = [
  "Church Members",
  "Children",
  "Choir",
  "Communicants",
  "Development",
  "Elim",
  "Kama",
  "MU",
  "Kayo",
  "PCC",
  "Praise and Worship",
  "Titus",
]

export default function AddClientForm() {
  const [formData, setFormData] = useState({
    name: "",
    familyNumber: "",
    contact: "",
    group: "",
    role: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <Input name="familyNumber" placeholder="Family Number" value={formData.familyNumber} onChange={handleChange} />
      <Input name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} />
      <Select onValueChange={(value: any) => setFormData({ ...formData, group: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Select a group" />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group} value={group}>
              {group}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input name="role" placeholder="Role (if applicable)" value={formData.role} onChange={handleChange} />
      <Button type="submit">Add Client</Button>
    </form>
  );
}

