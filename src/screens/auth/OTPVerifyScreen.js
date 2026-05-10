import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { verifyOTP, resendOTP } from '../../services/otpService';
import { loginUser } from '../../services/authService';

const OTP_LENGTH = 6;

const OTPVerifyScreen = ({ navigation, route }) => {
  const { email, cooldownSeconds = 60, devOtp } = route.params || {};

  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(cooldownSeconds);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Show dev OTP hint
  useEffect(() => {
    if (devOtp) {
      setSuccess(`Dev mode - OTP: ${devOtp}`);
    }
  }, [devOtp]);

  const handleDigitChange = (text, index) => {
    const newDigits = [...otpDigits];

    if (text.length > 1) {
      // Handle paste
      const chars = text.replace(/\D/g, '').split('').slice(0, OTP_LENGTH);
      chars.forEach((char, i) => {
        if (i + index < OTP_LENGTH) {
          newDigits[i + index] = char;
        }
      });
      setOtpDigits(newDigits);
      const nextIdx = Math.min(index + chars.length, OTP_LENGTH - 1);
      inputRefs.current[nextIdx]?.focus();
    } else {
      newDigits[index] = text.replace(/\D/g, '');
      setOtpDigits(newDigits);

      if (text && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    setError('');
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newDigits = [...otpDigits];
      newDigits[index - 1] = '';
      setOtpDigits(newDigits);
    }
  };

  const handleVerify = async () => {
    const otp = otpDigits.join('');

    if (otp.length !== OTP_LENGTH) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await verifyOTP(email, otp);

      if (result.success) {
        setSuccess('Email verified successfully!');
        // Navigate to main app after brief delay
        setTimeout(() => {
          if (navigation && navigation.replace) {
            navigation.replace('MainTabs');
          }
        }, 1000);
      } else {
        setError(result.error || 'Verification failed. Please try again.');
        setOtpDigits(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setResending(true);
    setError('');
    setSuccess('');

    try {
      const result = await resendOTP(email);

      if (result.success) {
        setResendTimer(result.cooldownSeconds || 60);
        setOtpDigits(Array(OTP_LENGTH).fill(''));
        setSuccess(result.devOtp ? `New OTP sent (dev: ${result.devOtp})` : 'New code sent to your email!');
        inputRefs.current[0]?.focus();
      } else {
        setError(result.error || 'Failed to resend. Please try again.');
      }
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0A1628', '#0D3B0F', '#1B5E20']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topSection}
      >
        <View style={styles.starsContainer}>
          {[...Array(20)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  left: `${(i * 5.3) % 100}%`,
                  top: `${(i * 7.1 + 5) % 90}%`,
                  width: 2 + (i % 3),
                  height: 2 + (i % 3),
                  opacity: 0.3 + (i % 4) * 0.15,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#D4AF37', '#F5E6B8', '#D4AF37']}
            style={styles.logoCircle}
          >
            <Ionicons name="shield-checkmark" size={38} color="#0A1628" />
          </LinearGradient>
          <Text style={styles.headerTitle}>Verify Your Email</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.formSection}
      >
        <View style={styles.formCard}>
          <Text style={styles.instructionText}>
            We've sent a 6-digit verification code to
          </Text>
          <Text style={styles.emailText}>{email}</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#E53935" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {success ? (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
              <Text style={styles.successText}>{success}</Text>
            </View>
          ) : null}

          {/* OTP Input Boxes */}
          <View style={styles.otpRow}>
            {otpDigits.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                  error ? styles.otpInputError : null,
                ]}
                value={digit}
                onChangeText={(text) => handleDigitChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={index === 0 ? OTP_LENGTH : 1}
                selectTextOnFocus
                autoFocus={index === 0}
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={loading ? ['#999', '#888'] : ['#1B5E20', '#2E7D32']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.verifyButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.verifyButtonText}>Verify Code</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Resend Section */}
          <View style={styles.resendSection}>
            <Text style={styles.resendLabel}>Didn't receive the code?</Text>
            {resendTimer > 0 ? (
              <View style={styles.timerRow}>
                <Ionicons name="time-outline" size={16} color="#999" />
                <Text style={styles.timerText}>
                  Resend in {formatTimer(resendTimer)}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleResend}
                disabled={resending}
                style={styles.resendButton}
              >
                {resending ? (
                  <ActivityIndicator color="#1B5E20" size="small" />
                ) : (
                  <Text style={styles.resendButtonText}>Resend Code</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Back */}
          <TouchableOpacity
            style={styles.changeEmailBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={16} color="#1B5E20" />
            <Text style={styles.changeEmailText}>Change email address</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topSection: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  formSection: {
    flex: 1,
    marginTop: -30,
  },
  formCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  emailText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B5E20',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#E53935',
    fontSize: 13,
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  successText: {
    color: '#2E7D32',
    fontSize: 13,
    flex: 1,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  otpInput: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  otpInputFilled: {
    borderColor: '#1B5E20',
    backgroundColor: '#F1F8E9',
  },
  otpInputError: {
    borderColor: '#E53935',
  },
  verifyButton: {
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  verifyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
  },
  verifyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resendLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  resendButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    color: '#1B5E20',
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  changeEmailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
  },
  changeEmailText: {
    color: '#1B5E20',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default OTPVerifyScreen;
