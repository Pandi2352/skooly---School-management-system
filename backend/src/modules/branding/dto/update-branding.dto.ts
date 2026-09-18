import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsIn, IsOptional, IsString, Length, MaxLength } from 'class-validator'
import { BRANDING_LIMITS, COLOR_THEMES, type ColorTheme } from '../constants/branding.constants'

const cleanText = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().replace(/[ \t]+/g, ' ') : value

/** Any subset of the branding text and colour; at least one field is required (checked in the service). */
export class UpdateBrandingDto {
  @ApiPropertyOptional({
    example: 'Green Valley Public School',
    minLength: BRANDING_LIMITS.displayNameMin,
    maxLength: BRANDING_LIMITS.displayNameMax,
  })
  @IsOptional()
  @Transform(cleanText)
  @IsString({ message: 'Display name must be text.' })
  @Length(BRANDING_LIMITS.displayNameMin, BRANDING_LIMITS.displayNameMax, {
    message: `Display name must be between ${BRANDING_LIMITS.displayNameMin} and ${BRANDING_LIMITS.displayNameMax} characters.`,
  })
  displayName?: string

  @ApiPropertyOptional({ example: 'GVPS', maxLength: BRANDING_LIMITS.shortNameMax })
  @IsOptional()
  @Transform(cleanText)
  @IsString({ message: 'Short name must be text.' })
  @MaxLength(BRANDING_LIMITS.shortNameMax, {
    message: `Short name must be ${BRANDING_LIMITS.shortNameMax} characters or fewer.`,
  })
  shortName?: string

  @ApiPropertyOptional({ example: 'Learning with purpose', maxLength: BRANDING_LIMITS.taglineMax })
  @IsOptional()
  @Transform(cleanText)
  @IsString({ message: 'Tagline must be text.' })
  @MaxLength(BRANDING_LIMITS.taglineMax, { message: `Tagline must be ${BRANDING_LIMITS.taglineMax} characters or fewer.` })
  tagline?: string

  @ApiPropertyOptional({ example: 'Affiliated to CBSE, New Delhi · Affiliation No. 1234567', maxLength: BRANDING_LIMITS.documentFooterMax })
  @IsOptional()
  @Transform(cleanText)
  @IsString({ message: 'Document footer must be text.' })
  @MaxLength(BRANDING_LIMITS.documentFooterMax, {
    message: `Document footer must be ${BRANDING_LIMITS.documentFooterMax} characters or fewer.`,
  })
  documentFooter?: string

  @ApiPropertyOptional({ enum: COLOR_THEMES, example: 'navy' })
  @IsOptional()
  @IsIn(COLOR_THEMES, { message: `Colour theme must be one of: ${COLOR_THEMES.join(', ')}.` })
  colorTheme?: ColorTheme
}
