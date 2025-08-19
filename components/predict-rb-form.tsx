"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Divider,
  Chip,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { predictRB } from "@/lib/api";
import { PredictRBRequest } from "@/lib/types";

const PredictRBForm = () => {
  const [formData, setFormData] = useState<PredictRBRequest>({
    age: 0,
    off_line_rank: 0,
    games_vs_top_ten: 0,
    games_vs_bottom_ten: 0,
    opponent_avg_madden_rating: 0,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PredictRBRequest, string>>
  >({});

  const mutation = useMutation({
    mutationFn: predictRB,
    onSuccess: (data) => {
      console.log("Prediction result:", data);
      alert(`Prediction: ${data.prediction}`);
    },
    onError: (error) => {
      console.error("Error submitting prediction:", error);
      alert("Error submitting prediction. Please try again.");
    },
  });

  const handleInputChange = (field: keyof PredictRBRequest, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setFormData((prev) => ({
      ...prev,
      [field]: numericValue,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PredictRBRequest, string>> = {};

    if (formData.age <= 0 || formData.age > 50) {
      newErrors.age = "Age must be between 1 and 50";
    }

    if (formData.off_line_rank <= 0 || formData.off_line_rank > 32) {
      newErrors.off_line_rank = "Offensive line rank must be between 1 and 32";
    }

    if (formData.games_vs_top_ten < 0 || formData.games_vs_top_ten > 17) {
      newErrors.games_vs_top_ten = "Games vs top ten must be between 0 and 17";
    }

    if (formData.games_vs_bottom_ten < 0 || formData.games_vs_bottom_ten > 17) {
      newErrors.games_vs_bottom_ten =
        "Games vs bottom ten must be between 0 and 17";
    }

    if (
      formData.opponent_avg_madden_rating < 40 ||
      formData.opponent_avg_madden_rating > 99
    ) {
      newErrors.opponent_avg_madden_rating =
        "Madden rating must be between 40 and 99";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    mutation.mutate(formData);
  };

  const resetForm = () => {
    setFormData({
      age: 0,
      off_line_rank: 0,
      games_vs_top_ten: 0,
      games_vs_bottom_ten: 0,
      opponent_avg_madden_rating: 0,
    });
    setErrors({});
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-start px-6 pt-6">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">RB Performance Predictor</h1>
            <Chip size="sm" variant="flat" color="primary">
              NFL
            </Chip>
          </div>
          <p className="text-default-600">
            Enter player and opponent statistics to predict running back
            performance
          </p>
        </CardHeader>

        <Divider />

        <CardBody className="px-6 py-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-default-700">
                Player Information
              </h3>

              <Input
                type="number"
                label="Age"
                placeholder="Enter player age"
                value={formData.age.toString()}
                onChange={(e) => handleInputChange("age", e.target.value)}
                isInvalid={!!errors.age}
                errorMessage={errors.age}
                description="Player's current age"
                min="1"
                max="50"
                startContent={
                  <span className="text-default-400 text-small">👤</span>
                }
              />
            </div>

            <Divider />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-default-700">
                Team Statistics
              </h3>

              <Input
                type="number"
                label="Offensive Line Rank"
                placeholder="Enter offensive line rank"
                value={formData.off_line_rank.toString()}
                onChange={(e) =>
                  handleInputChange("off_line_rank", e.target.value)
                }
                isInvalid={!!errors.off_line_rank}
                errorMessage={errors.off_line_rank}
                description="Team's offensive line ranking (1-32)"
                min="1"
                max="32"
                startContent={
                  <span className="text-default-400 text-small">#</span>
                }
              />
            </div>

            <Divider />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-default-700">
                Schedule Analysis
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Games vs Top 10 Defenses"
                  placeholder="0"
                  value={formData.games_vs_top_ten.toString()}
                  onChange={(e) =>
                    handleInputChange("games_vs_top_ten", e.target.value)
                  }
                  isInvalid={!!errors.games_vs_top_ten}
                  errorMessage={errors.games_vs_top_ten}
                  description="Games against top 10 defenses"
                  min="0"
                  max="17"
                  startContent={
                    <span className="text-red-500 text-small">🔥</span>
                  }
                />

                <Input
                  type="number"
                  label="Games vs Bottom 10 Defenses"
                  placeholder="0"
                  value={formData.games_vs_bottom_ten.toString()}
                  onChange={(e) =>
                    handleInputChange("games_vs_bottom_ten", e.target.value)
                  }
                  isInvalid={!!errors.games_vs_bottom_ten}
                  errorMessage={errors.games_vs_bottom_ten}
                  description="Games against bottom 10 defenses"
                  min="0"
                  max="17"
                  startContent={
                    <span className="text-green-500 text-small">✅</span>
                  }
                />
              </div>
            </div>

            <Divider />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-default-700">
                Opponent Analysis
              </h3>

              <Input
                type="number"
                label="Opponent Average Madden Rating"
                placeholder="Enter average rating"
                value={formData.opponent_avg_madden_rating.toString()}
                onChange={(e) =>
                  handleInputChange(
                    "opponent_avg_madden_rating",
                    e.target.value
                  )
                }
                isInvalid={!!errors.opponent_avg_madden_rating}
                errorMessage={errors.opponent_avg_madden_rating}
                description="Average Madden rating of opposing defenses (40-99)"
                min="40"
                max="99"
                step="0.1"
                startContent={
                  <span className="text-default-400 text-small">⭐</span>
                }
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                color="primary"
                size="lg"
                isLoading={mutation.isPending}
                className="flex-1"
                onPress={handleSubmit}
              >
                {mutation.isPending ? "Analyzing..." : "Predict Performance"}
              </Button>

              <Button
                variant="flat"
                size="lg"
                onPress={resetForm}
                className="flex-1 sm:flex-initial"
              >
                Reset Form
              </Button>
            </div>

            <Card className="bg-default-50 dark:bg-default-100/50">
              <CardBody className="p-4">
                <h4 className="font-semibold mb-2">Prediction Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-small">
                  <span>
                    Age: <strong>{formData.age}</strong>
                  </span>
                  <span>
                    O-Line Rank: <strong>{formData.off_line_rank}</strong>
                  </span>
                  <span>
                    vs Top 10: <strong>{formData.games_vs_top_ten}</strong>
                  </span>
                  <span>
                    vs Bottom 10:{" "}
                    <strong>{formData.games_vs_bottom_ten}</strong>
                  </span>
                  <span className="col-span-2">
                    Avg Opponent Rating:{" "}
                    <strong>{formData.opponent_avg_madden_rating}</strong>
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PredictRBForm;
