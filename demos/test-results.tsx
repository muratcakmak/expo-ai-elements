import {
  Test,
  TestDuration,
  TestError,
  TestErrorMessage,
  TestErrorStack,
  TestName,
  TestResults,
  TestResultsContent,
  TestResultsDuration,
  TestResultsHeader,
  TestResultsProgress,
  TestResultsSummary,
  TestStatus,
  TestSuite,
  TestSuiteContent,
  TestSuiteName,
} from '@/components/ai/test-results';
import { PreviewSection } from '@/components/showcase/preview';
import { View } from 'react-native';

export function TestResultsDemo() {
  return (
    <View className="gap-6">
      <PreviewSection title="Full test report" description="Multiple suites with progress bar">
        <TestResults
          summary={{
            passed: 12,
            failed: 2,
            skipped: 1,
            total: 15,
            duration: 3245,
          }}
        >
          <TestResultsHeader>
            <TestResultsSummary />
            <TestResultsDuration />
          </TestResultsHeader>
          <View className="border-b border-border px-4 py-3">
            <TestResultsProgress />
          </View>
          <TestResultsContent>
            <TestSuite name="Authentication" status="passed" defaultOpen>
              <TestSuiteName />
              <TestSuiteContent>
                <Test name="should login with valid credentials" status="passed" duration={45} />
                <Test name="should reject invalid password" status="passed" duration={32} />
                <Test name="should handle expired tokens" status="passed" duration={28} />
              </TestSuiteContent>
            </TestSuite>

            <TestSuite name="User API" status="failed" defaultOpen>
              <TestSuiteName />
              <TestSuiteContent>
                <Test name="should create new user" status="passed" duration={120} />
                <Test name="should update user profile" status="failed" duration={85}>
                  <TestError>
                    <TestErrorMessage>Expected status 200 but received 500</TestErrorMessage>
                    <TestErrorStack>
                      {`  at Object.<anonymous> (src/user.test.ts:45:12)
  at Promise.then.completed (node_modules/jest-circus/build/utils.js:391:28)`}
                    </TestErrorStack>
                  </TestError>
                </Test>
                <Test name="should delete user" status="skipped" />
              </TestSuiteContent>
            </TestSuite>

            <TestSuite name="Database" status="failed">
              <TestSuiteName />
              <TestSuiteContent>
                <Test name="should connect to database" status="passed" duration={200} />
                <Test name="should handle connection timeout" status="failed" duration={5000}>
                  <TestError>
                    <TestErrorMessage>Connection timed out after 5000ms</TestErrorMessage>
                  </TestError>
                </Test>
              </TestSuiteContent>
            </TestSuite>
          </TestResultsContent>
        </TestResults>
      </PreviewSection>
    </View>
  );
}
