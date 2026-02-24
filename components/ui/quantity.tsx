"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus } from "lucide-react"

interface QuantityInputProps {
  value?: number
  min?: number
  max?: number
  onChange?: (value: number) => void
}

export function QuantityInput({
  value = 1,
  min = 1,
  max,
  onChange,
}: QuantityInputProps) {
  const [qty, setQty] = useState(value)

  const updateQty = (newValue: number) => {
    if (newValue < min) return
    if (max && newValue > max) return

    setQty(newValue)
    onChange?.(newValue)
  }

  return (
    <div className="inline-flex items-center rounded-md border overflow-hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => updateQty(qty - 1)}
        disabled={qty <= min}
      >
        <Minus className="w-4 h-4" />
      </Button>

      <Input
        type="number"
        value={qty}
        onChange={(e) => updateQty(Number(e.target.value))}
        className="w-16 text-center border-0 focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => updateQty(qty + 1)}
        disabled={max ? qty >= max : false}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )
}