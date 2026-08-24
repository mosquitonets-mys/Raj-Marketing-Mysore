// Measurement Parser Module
export class MeasurementParser {
    constructor() {
        this.patterns = [
            // Pattern: 31½ × 68¾
            {
                regex: /(\d+\s*[½¼¾]?)\s*[×xX*]\s*(\d+\s*[½¼¾]?)/,
                parse: this.parseFractional.bind(this)
            },
            // Pattern: 30 1/4 × 68 3/4
            {
                regex: /(\d+\s+\d+\/\d+)\s*[×xX*]\s*(\d+\s+\d+\/\d+)/,
                parse: this.parseMixedFraction.bind(this)
            },
            // Pattern: 31.5 × 68.75
            {
                regex: /(\d+\.?\d*)\s*[×xX*]\s*(\d+\.?\d*)/,
                parse: this.parseDecimal.bind(this)
            },
            // Pattern with quantity
            {
                regex: /(\d+\.?\d*\s*[½¼¾]?)\s*[×xX*]\s*(\d+\.?\d*\s*[½¼¾]?)\s*[-–—]\s*(\d+)\s*Nos?/i,
                parse: this.parseWithQuantity.bind(this)
            }
        ];
    }

    parseText(text) {
        const results = [];
        const lines = text.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
            const parsed = this.parseLine(line);
            if (parsed) {
                results.push(parsed);
            }
        }
        
        return results;
    }

    parseLine(line) {
        // Try each pattern
        for (const pattern of this.patterns) {
            const match = line.match(pattern.regex);
            if (match) {
                try {
                    return pattern.parse(match);
                } catch (e) {
                    console.warn('Parse failed:', e);
                    return null;
                }
            }
        }
        
        // Try to detect if this line contains a measurement
        if (this.containsMeasurement(line)) {
            return {
                width: null,
                height: null,
                quantity: 1,
                middlePieces: 0,
                notes: line,
                needsVerification: true,
                raw: line
            };
        }
        
        return null;
    }

    parseFractional(match) {
        const width = this.convertFractionalToDecimal(match[1].trim());
        const height = this.convertFractionalToDecimal(match[2].trim());
        
        return {
            width: width,
            height: height,
            quantity: 1,
            middlePieces: 0,
            needsVerification: false,
            raw: match[0]
        };
    }

    parseMixedFraction(match) {
        const width = this.convertMixedFractionToDecimal(match[1].trim());
        const height = this.convertMixedFractionToDecimal(match[2].trim());
        
        return {
            width: width,
            height: height,
            quantity: 1,
            middlePieces: 0,
            needsVerification: false,
            raw: match[0]
        };
    }

    parseDecimal(match) {
        return {
            width: parseFloat(match[1]),
            height: parseFloat(match[2]),
            quantity: 1,
            middlePieces: 0,
            needsVerification: false,
            raw: match[0]
        };
    }

    parseWithQuantity(match) {
        const width = this.convertFractionalToDecimal(match[1].trim());
        const height = this.convertFractionalToDecimal(match[2].trim());
        const quantity = parseInt(match[3]);
        
        return {
            width: width,
            height: height,
            quantity: quantity,
            middlePieces: 0,
            needsVerification: false,
            raw: match[0]
        };
    }

    convertFractionalToDecimal(str) {
        const parts = str.match(/^(\d+)\s*([½¼¾])?$/);
        if (!parts) return parseFloat(str);
        
        const whole = parseInt(parts[1]);
        const fraction = parts[2] || '';
        
        const fractionMap = {
            '½': 0.5,
            '¼': 0.25,
            '¾': 0.75
        };
        
        return whole + (fractionMap[fraction] || 0);
    }

    convertMixedFractionToDecimal(str) {
        const parts = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
        if (!parts) return parseFloat(str);
        
        const whole = parseInt(parts[1]);
        const numerator = parseInt(parts[2]);
        const denominator = parseInt(parts[3]);
        
        return whole + (numerator / denominator);
    }

    containsMeasurement(line) {
        // Check for common measurement patterns
        return /[\d.]+\s*[×xX*]\s*[\d.]+/.test(line) ||
               /[\d.]+\s*[xX]\s*[\d.]+/.test(line);
    }

    detectMiddlePieces(lines) {
        const middlePiecePatterns = [
            /(\d+)\s*(?:middle|mid)\s*(?:pieces?|bars?)/i,
            /middle\s*(?:pieces?|bars?)\s*[:=]\s*(\d+)/i,
            /(\d+)\s*No(?:s)?\.?\s*(?:middle|mid)/i
        ];
        
        for (const line of lines) {
            for (const pattern of middlePiecePatterns) {
                const match = line.match(pattern);
                if (match) {
                    return parseInt(match[1]);
                }
            }
        }
        
        return 0;
    }

    detectCategory(line) {
        const categories = ['window', 'door', 'sliding', 'fixed', 'casement'];
        for (const cat of categories) {
            if (line.toLowerCase().includes(cat)) {
                return cat.charAt(0).toUpperCase() + cat.slice(1);
            }
        }
        return 'Standard';
    }
          }
