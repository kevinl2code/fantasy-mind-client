import React from "react";
import { Card, CardBody, CardHeader, Chip, Progress } from "@heroui/react";
import { TrainRBResponse } from "@/lib/types";

interface TrainResultsDisplayProps {
  results: TrainRBResponse;
  onClose: () => void;
}

const TrainResultsDisplay = ({
  results,
  onClose,
}: TrainResultsDisplayProps) => {
  // Convert feature importance to sorted array for better display
  const featureImportanceArray = Object.entries(results.feature_importance)
    .map(([feature, importance]) => ({
      feature: feature
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      importance,
      absImportance: Math.abs(importance),
    }))
    .sort((a, b) => b.absImportance - a.absImportance);

  const maxAbsImportance = Math.max(
    ...featureImportanceArray.map((f) => f.absImportance)
  );

  const formatR2 = (value: number) => {
    const percentage = (value * 100).toFixed(2);
    return `${percentage}%`;
  };

  const getR2Color = (value: number) => {
    if (value >= 0.7) return "success";
    if (value >= 0.3) return "warning";
    return "danger";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Training Results</h2>
            <div className="flex items-center gap-2 mt-2">
              <Chip
                color={results.status === "success" ? "success" : "danger"}
                variant="flat"
              >
                {results.status.toUpperCase()}
              </Chip>
              <Chip variant="bordered">
                {results.model_type.replace(/_/g, " ").toUpperCase()}
              </Chip>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </CardHeader>

        <CardBody className="space-y-6">
          {/* Model Performance */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Model Performance (R²)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardBody className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Training R²</p>
                  <p
                    className={`text-2xl font-bold text-${getR2Color(results.train_r2)}`}
                  >
                    {formatR2(results.train_r2)}
                  </p>
                  <Progress
                    value={Math.max(0, results.train_r2 * 100)}
                    color={getR2Color(results.train_r2)}
                    className="mt-2"
                  />
                </CardBody>
              </Card>

              <Card>
                <CardBody className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Test R²</p>
                  <p
                    className={`text-2xl font-bold text-${getR2Color(results.test_r2)}`}
                  >
                    {formatR2(results.test_r2)}
                  </p>
                  <Progress
                    value={Math.max(0, results.test_r2 * 100)}
                    color={getR2Color(results.test_r2)}
                    className="mt-2"
                  />
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Feature Importance */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Feature Importance</h3>
            <div className="space-y-3">
              {featureImportanceArray.map(
                ({ feature, importance, absImportance }) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-32 text-sm font-medium truncate">
                      {feature}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div
                          className={`h-4 rounded-full ${
                            importance >= 0 ? "bg-green-500" : "bg-red-500"
                          }`}
                          style={{
                            width: `${(absImportance / maxAbsImportance) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="w-20 text-right text-sm">
                        <span
                          className={
                            importance >= 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          {importance >= 0 ? "+" : ""}
                          {importance.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Model Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Model Information</h3>
            <Card>
              <CardBody>
                <p className="text-sm">
                  <strong>Model Path:</strong>
                  <br />
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {results.model_path}
                  </code>
                </p>
              </CardBody>
            </Card>
          </div>

          {/* Performance Interpretation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
            <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <CardBody>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Training R²:</strong> {formatR2(results.train_r2)} -
                    {results.train_r2 >= 0.7
                      ? " Excellent fit"
                      : results.train_r2 >= 0.3
                        ? " Moderate fit"
                        : " Poor fit"}
                  </p>
                  <p>
                    <strong>Test R²:</strong> {formatR2(results.test_r2)} -
                    {results.test_r2 >= 0.7
                      ? " Excellent generalization"
                      : results.test_r2 >= 0.3
                        ? " Moderate generalization"
                        : " Poor generalization"}
                  </p>
                  <p className="mt-3 text-gray-600 dark:text-gray-400">
                    R² values closer to 100% indicate better model performance.
                    Negative values suggest the model performs worse than a
                    simple average.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TrainResultsDisplay;
