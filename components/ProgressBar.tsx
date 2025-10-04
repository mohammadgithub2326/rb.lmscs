
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const stepNames = [
  'Personal Info', 
  'Contact Details',
  'Address Info',
  'Education & Bank',
  'Review & Submit'
];

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {stepNames.map((name, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors
                ${isActive ? 'bg-blue-600 text-white border-blue-600' : 
                  isCompleted ? 'bg-green-500 text-white border-green-500' : 
                  'bg-white text-gray-400 border-gray-300'}
              `}>
                {isCompleted ? (
                  <i className="ri-check-line"></i>
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < totalSteps && (
                <div className={`
                  w-16 h-1 mx-2 transition-colors
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                `} />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">{stepNames[currentStep - 1]}</h3>
      </div>
    </div>
  );
}