import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';

interface Task {
  id: string;
  name: string;
  timeframe: string;
  completed: boolean;
}

function App() {
  const initialTasks: Task[] = [
    { name: 'Finish ray implementation', timeframe: '20 hours', completed: false, id: '1' },
    { name: 'Finish database project', timeframe: '6 days', completed: false, id: '2' },
    { name: 'Finish courses', timeframe: '4.5 months', completed: false, id: '3' },
    { name: 'Finish PhD', timeframe: '4.42 years', completed: false, id: '4' },
    { name: 'Succeed', timeframe: '33.15 years', completed: false, id: '5' },
  ];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [showHeader, setShowHeader] = useState(false);
  
  // Auto-scroll to bottom (first task) on component mount
  useEffect(() => {
    // Small delay to ensure everything is rendered
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }, 100);
  }, []);
  
  // Handle scroll to update current task index and header visibility
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollPosition = container.scrollTop;
        const totalHeight = container.scrollHeight - container.clientHeight;
        
        // Show header when not at the bottom
        setShowHeader(scrollPosition < totalHeight);
        
        // Find which task element is most visible in the viewport
        const taskElements = Array.from(container.querySelectorAll('.task-item'));
        let mostVisibleIndex = 0;
        let maxVisibleArea = 0;
        
        taskElements.forEach((el, idx) => {
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          // Calculate how much of the element is visible in the viewport
          const visibleTop = Math.max(rect.top, containerRect.top);
          const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          
          // Update if this element has more visible area than previous max
          if (visibleHeight > maxVisibleArea) {
            maxVisibleArea = visibleHeight;
            // Convert from reversed display index to original task index
            mostVisibleIndex = tasks.length - 1 - idx;
          }
        });
        
        setCurrentTaskIndex(mostVisibleIndex);
      }
    };
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [tasks]);
  
  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Reverse the tasks array to display them in reverse order (long-term at top, short-term at bottom)
  const reversedTasks = [...tasks].reverse();

  // Get previous task in the timeline (which would be the "next" one to see when scrolling up)
  const getNextVisibleTask = () => {
    // When at index tasks.length-1, there is no next task (we're at the top/longest term task)
    if (currentTaskIndex >= tasks.length - 1) return null;
    
    // The next task when scrolling up is the one with a higher index in the original array
    return tasks[currentTaskIndex + 1];
  };
  
  const nextTask = getNextVisibleTask();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed header showing next task */}
      {showHeader && nextTask && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 pt-6 z-10 flex items-center"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="max-w-screen-2xl mx-auto w-full px-6 sm:px-8 lg:px-10 flex items-center">
            <div 
              className={`w-8 h-8 rounded-full mr-4 flex-shrink-0 ${nextTask.completed ? 'bg-green-100 border-2 border-green-500' : 'border-2 border-gray-400'}`}
            >
              {nextTask.completed && (
                <svg className="w-full h-full text-green-500" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" fill="currentColor" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Next in queue:</p>
              <h3 className={`text-xl font-bold ${nextTask.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                {nextTask.name} - {nextTask.timeframe}
              </h3>
            </div>
          </div>
        </motion.div>
      )}

      <div className="min-h-screen flex flex-col">
        <main className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-10 mb-4 pt-32">
          <div 
            ref={scrollContainerRef}
            className="overflow-y-auto max-h-screen pb-40 pt-32 snap-y snap-mandatory [scroll-padding-top:4rem]"
          >
            {reversedTasks.map((task) => (
              <motion.div
                key={task.id}
                className="bg-white shadow-lg rounded-lg p-12 pt-6 mb-6 mt-8 h-[76vh] w-full flex flex-col justify-center snap-start task-item"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.5,
                    ease: "easeOut"
                  }
                }}
                viewport={{ once: false, amount: 0.6 }}
              >
                <div className="flex items-center mb-12">
                  <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => toggleTaskCompletion(task.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ 
                      borderWidth: '4px',
                      borderColor: task.completed ? '#10B981' : '#9CA3AF', 
                      backgroundColor: task.completed ? '#ECFDF5' : 'transparent'
                    }}
                  >
                    {task.completed && (
                      <motion.svg
                        className="w-14 h-14 text-green-500"
                        viewBox="0 0 20 20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" fill="currentColor" />
                      </motion.svg>
                    )}
                  </motion.div>
                  <motion.h2
                    className={`text-8xl font-bold ml-10 ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
                  >
                    {task.name}
                  </motion.h2>
                </div>
                <motion.div 
                  className="text-6xl font-bold text-gray-600"
                  style={{ marginLeft: '8rem' }}
                >
                  {task.timeframe}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;