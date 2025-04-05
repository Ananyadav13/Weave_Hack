"use client";


import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

export default function MarketplaceRequestForm() {
  return (
    <motion.div
      className="max-w-2xl mx-auto p-4 pt-32"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-2xl rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur-md" >
        <CardContent className="p-8 space-y-8">
          <h2 className="text-3xl font-extrabold text-center text-neutral-800">
            Post a New Request
          </h2>

          <div className="space-y-4">
            {[
              { id: "title", label: "Title", placeholder: "Need help with logo design..." },
              { id: "description", label: "Description", placeholder: "Explain your request in detail...", isTextarea: true },
              { id: "skill", label: "Skill", placeholder: "e.g. Graphic Design, Coding, Writing..." },
              { id: "tool", label: "Tool Access", placeholder: "e.g. Figma, Notion, GPT-4..." },
              { id: "type", label: "Type", placeholder: "e.g. One-time task, Ongoing collaboration..." },
              { id: "reputation", label: "Reputation", placeholder: "e.g. Trusted user, Verified professional..." }
            ].map(({ id, label, placeholder, isTextarea }) => (
              <div key={id}>
                <Label htmlFor={id} className="text-lg font-semibold text-neutral-700">{label}</Label>
                {isTextarea ? (
                  <Textarea
                    id={id}
                    placeholder={placeholder}
                    className="mt-1 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                ) : (
                  <Input
                    id={id}
                    placeholder={placeholder}
                    className="mt-1 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="pt-4"
            >
              <Button
                className="w-full text-white font-semibold py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md"
                type="submit"
              >
                Submit Request
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}