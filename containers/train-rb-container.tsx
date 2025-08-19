"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { trainRB } from "@/lib/api";
import { TrainRBResponse } from "@/lib/types";

import TrainButton from "@/components/train-button";
import TrainResultsDisplay from "@/components/train-results-display";

interface TrainRBContainerProps {
  className?: string;
}

const TrainRBContainer = ({ className = "" }: TrainRBContainerProps) => {
  const [showResults, setShowResults] = useState(false);
  const [trainResults, setTrainResults] = useState<TrainRBResponse | null>(
    null
  );

  const trainMutation = useMutation({
    mutationFn: trainRB,
    onSuccess: (data) => {
      console.log("Training result:", data);
      setTrainResults(data);
      setShowResults(true);
    },
    onError: (error) => {
      console.error("Error training model:", error);
      alert("Error training model. Please try again.");
    },
  });

  const handleTrain = () => {
    trainMutation.mutate();
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setTrainResults(null);
  };

  return (
    <div className={className}>
      <TrainButton
        onTrain={handleTrain}
        isLoading={trainMutation.isPending}
        error={trainMutation.error}
      />

      {showResults && trainResults && (
        <TrainResultsDisplay
          results={trainResults}
          onClose={handleCloseResults}
        />
      )}
    </div>
  );
};

export default TrainRBContainer;
